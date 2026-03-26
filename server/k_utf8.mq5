//|          Megaladon Adaptive Intelligence.mq5                     |
//+------------------------------------------------------------------+
#property copyright "Megaladon Adaptive Intelligence"
#property link      "www.MegaladonAI.com"
#property version   "1.00"

#include <Trade\Trade.mqh>
#include <Indicators\Custom.mqh>

// --- Constants (do not optimize) ---
#define VOTE_COUNT 42


// --- Runtime flags ---
bool g_isOpt=false; // true in Strategy Tester optimization
bool g_isTester=false; // true in Strategy Tester
bool g_isVisual=false; // visual mode (tester)

input bool Visual_AttachNativeIndicators = false; // XAUUSD H1 starter preset: keep visuals off by default for faster optimization
input bool Visual_ShowAdvancedPanel      = false; // XAUUSD H1 starter preset: off by default for faster optimization
input int  Visual_PanelCorner            = 0;    // 0=TL 1=TR 2=BL 3=BR
input int  Visual_PanelX                 = 8;
input int  Visual_PanelY                 = 18;

input bool Visual_ShowEffectivenessPanel  = false; // XAUUSD H1 starter preset: off by default for faster optimization
input int  Visual_EffectivenessTopN       = 6;    // top-N indicators to list
input int  Visual_PanelUpdateMs           = 500;  // panel refresh throttle (ms); >=200 recommended




// -----------------------------
// SIGNAL / EXECUTION HARDENING
// -----------------------------
input bool Signals_UseClosedBar      = true;  // use shift=1 (closed bar) for ALL signal votes
input bool Entry_TickConfirm         = true;  // optional tick confirm (shift=0) only at execution
input int  Entry_TickConfirm_MaxAgeMs= 1200;  // max age of cached tick/confirm window
input int  Exec_MaxRetries           = 3;     // transient trade retry attempts
input int  Exec_BaseBackoffMs        = 120;   // base backoff for retries (ms)
input int  Exec_MaxBackoffMs         = 1500;  // max backoff cap (ms)
input int  Exec_MinDeviationPoints   = 10;    // minimum deviation in points
input double Exec_DeviationSpreadMult= 1.5;   // deviation = max(minDev, spreadPoints*mult)

// --- Cached symbol properties (reduces SymbolInfo* calls in hot paths) ---
string g_sym_cached = "";
int    g_sym_digits = 0;
double g_sym_point  = 0.0;
double g_sym_tick_size = 0.0;
double g_sym_tick_value = 0.0;
double g_sym_vol_step = 0.0;
double g_sym_vol_min  = 0.0;
double g_sym_vol_max  = 0.0;
long   g_sym_stops_level = 0;
long   g_sym_freeze_level = 0;

// --- Tick cache (reduces SymbolInfoDouble(BID/ASK) calls) ---
MqlTick  g_tick_cache;
string   g_tick_cache_sym = "";
datetime g_tick_cache_ts = 0;
bool     g_tick_cache_ok = false;

inline void UpdateTickCache(const string sym)
{
   g_tick_cache_ok = SymbolInfoTick(sym, g_tick_cache);
   g_tick_cache_sym = sym;
   if(g_tick_cache_ok) g_tick_cache_ts = g_tick_cache.time;
}

inline double K2_Bid(const string sym)
{
   if(g_tick_cache_ok && g_tick_cache_sym == sym) return g_tick_cache.bid;
   return SymbolInfoDouble(sym, SYMBOL_BID);
}
inline double K2_Ask(const string sym)
{
   if(g_tick_cache_ok && g_tick_cache_sym == sym) return g_tick_cache.ask;
   return SymbolInfoDouble(sym, SYMBOL_ASK);
}


// --- Bar time cache (reduces repeated iTime() calls in hot paths) ---
int K2_TfSlot(ENUM_TIMEFRAMES tf)
{
   switch(tf)
   {
      case PERIOD_CURRENT: return 0;
      case PERIOD_M1:      return 1;
      case PERIOD_M5:      return 2;
      case PERIOD_M15:     return 3;
      case PERIOD_M30:     return 4;
      case PERIOD_H1:      return 5;
      case PERIOD_H4:      return 6;
      case PERIOD_D1:      return 7;
      case PERIOD_W1:      return 8;
      case PERIOD_MN1:     return 9;
      default:             return -1;
   }
}

// Cached iTime() per (symbol, tf, shift) keyed by current tick time (seconds).
datetime K2_iTimeCached(const string sym, ENUM_TIMEFRAMES tf, const int shift)
{
   // We only cache common timeframes and shifts 0..3. Others fall back to iTime().
   int slot = K2_TfSlot(tf);
   if(slot < 0 || shift < 0 || shift > 3) return iTime(sym, tf, shift);

   static string   s_sym[10][4];
   static datetime s_key[10][4];
   static datetime s_val[10][4];

   datetime key = (g_tick_cache_ok ? g_tick_cache.time : TimeCurrent());
   if(s_sym[slot][shift] != sym || s_key[slot][shift] != key)
   {
      s_val[slot][shift] = iTime(sym, tf, shift);
      s_sym[slot][shift] = sym;
      s_key[slot][shift] = key;
   }
   return s_val[slot][shift];
}

void RefreshSymbolCache(const string sym)
{
   if(g_sym_cached == sym && g_sym_point > 0.0) return;

   g_sym_cached = sym;
   g_sym_digits = (int)SymbolInfoInteger(sym, SYMBOL_DIGITS);

   g_sym_point = SymbolInfoDouble(sym, SYMBOL_POINT);
   if(!IsGoodNumber(g_sym_point) || g_sym_point <= 0.0) g_sym_point = _Point;

   g_sym_tick_size  = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_SIZE);
   g_sym_tick_value = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE);

   g_sym_vol_step = SymbolInfoDouble(sym, SYMBOL_VOLUME_STEP);
   g_sym_vol_min  = SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN);
   g_sym_vol_max  = SymbolInfoDouble(sym, SYMBOL_VOLUME_MAX);

   g_sym_stops_level  = SymbolInfoInteger(sym, SYMBOL_TRADE_STOPS_LEVEL);
   g_sym_freeze_level = SymbolInfoInteger(sym, SYMBOL_TRADE_FREEZE_LEVEL);

   // defensive fallbacks
   if(g_sym_vol_step <= 0.0) g_sym_vol_step = 0.01;
   if(g_sym_vol_min  <= 0.0) g_sym_vol_min  = g_sym_vol_step;
   if(g_sym_vol_max  < g_sym_vol_min) g_sym_vol_max = g_sym_vol_min;
}

// --- One-pass position cache (updated once per tick) ---
struct K2_PosCache
{
   datetime last_tick_time;
   int      total_all;
   int      total_mine;
   int      pending_all;
   int      pending_mine;
   bool     has_buy;
   bool     has_sell;
   double   vol_buy;
   double   vol_sell;
};
K2_PosCache g_pos_cache;

// -----------------------------
// Internal ownership / discipline guard (always-on; no inputs)
// Closes positions and deletes pending orders not opened by this EA.
// Throttled so it does not materially affect trading performance.
// -----------------------------
datetime g_own_guard_last_run = 0;
ulong    g_own_guard_tick_ctr = 0;

bool K2_OwnsPositionTicket(const ulong ticket)
{
   if(ticket == 0) return false;
   if(!PositionSelectByTicket(ticket)) return false;
   return ((ulong)PositionGetInteger(POSITION_MAGIC) == (ulong)MagicNumber);
}

bool K2_OwnsOrderTicket(const ulong ticket)
{
   if(ticket == 0) return false;
   if(!OrderSelect(ticket)) return false;
   return ((ulong)OrderGetInteger(ORDER_MAGIC) == (ulong)MagicNumber);
}

inline bool K2_HasExposureOrPendingFast()
{
   datetime tt = (g_tick_cache_ok ? g_tick_cache.time : TimeCurrent());
   if(g_pos_cache.last_tick_time == tt && g_pos_cache.total_all >= 0 && g_pos_cache.pending_all >= 0)
      return (g_pos_cache.total_all > 0 || g_pos_cache.pending_all > 0);
   return (PositionsTotal() > 0 || OrdersTotal() > 0);
}

void K2_EnforceOwnershipGuard()
{
   if(!K2_HasExposureOrPendingFast()) return;

   datetime now_ts = (g_tick_cache_ok ? g_tick_cache.time : TimeCurrent());
   if(now_ts != 0 && g_own_guard_last_run == now_ts) return;
   g_own_guard_last_run = now_ts;
