import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, ArrowRight, Tag, Clock, TrendingUp, Shield, Database, BarChart3, Users } from "lucide-react";
import { useState } from "react";

const posts = [
  {
    slug: "why-90-percent-of-funded-accounts-fail",
    title: "Why 90% of Funded Accounts Fail (And How to Be the 10%)",
    excerpt: "The prop firm industry is booming, yet over 90% of traders fail their challenges. Discover the three primary reasons funded accounts are blown and the exact framework the top 10% use to stay funded.",
    date: "March 21, 2026",
    author: "FoldForge Editorial",
    category: "Prop Firm",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1611974717484-7da8c1746b62?auto=format&fit=crop&q=80&w=800",
    icon: Shield,
  },
  {
    slug: "your-backtests-are-lying-the-broker-data-gap",
    title: "Your Backtests Are Lying: The Broker Data Gap Explained",
    excerpt: "Why '99% modeling quality' isn't enough anymore. Learn why your backtests don't match live results and how to sync real broker data for accurate validation.",
    date: "March 18, 2026",
    author: "FoldForge Editorial",
    category: "Data Sync",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    icon: Database,
  },
  {
    slug: "the-ultimate-ea-validation-checklist-for-2026",
    title: "The Ultimate EA Validation Checklist for 2026",
    excerpt: "5 tests every Expert Advisor must pass before you risk a single dollar. From Monte Carlo simulations to Walk-Forward analysis — your complete validation roadmap.",
    date: "March 15, 2026",
    author: "FoldForge Editorial",
    category: "EA Testing",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800",
    icon: BarChart3,
  },
  {
    slug: "monte-carlo-simulation-for-forex-traders",
    title: "Monte Carlo Simulation for Forex Traders: A Complete Guide",
    excerpt: "Most traders have heard of Monte Carlo simulation but have never used it. This guide explains exactly what it is, why it matters for prop firm traders, and how to run one today.",
    date: "March 10, 2026",
    author: "FoldForge Editorial",
    category: "Risk Management",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800",
    icon: TrendingUp,
  },
  {
    slug: "best-prop-firms-for-ea-traders-in-2026",
    title: "Best Prop Firms for EA Traders in 2026: A Complete Comparison",
    excerpt: "Not all prop firms are created equal for algorithmic traders. We compare the top 6 prop firms on rules, payouts, EA restrictions, and compatibility with automated trading systems.",
    date: "March 5, 2026",
    author: "FoldForge Editorial",
    category: "Prop Firm",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=800",
    icon: Users,
  },
];

const categories = ["All", "Prop Firm", "EA Testing", "Risk Management", "Data Sync"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = posts[0];
  const regularPosts = filteredPosts.filter(p => !p.featured || activeCategory !== "All");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Institutional Trading Insights</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6">
              The <span className="gold-text">FoldForge</span> Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Institutional-grade insights on EA testing, risk management, and prop firm trading. Written for serious traders.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {activeCategory === "All" && (
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer mb-12 border-primary/20">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Featured</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Tag size={11} className="text-primary" /> {featuredPost.category}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-['Playfair_Display'] leading-tight mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {featuredPost.date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {featuredPost.readTime}</span>
                      </div>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeCategory === "All" ? posts.slice(1) : filteredPosts).map((post) => (
              <Card key={post.slug} className="bg-card border-border overflow-hidden hover:border-primary/30 transition-all group hover:shadow-xl hover:shadow-primary/5">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="space-y-2 pb-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      <Tag size={10} /> {post.category}
                    </span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={10} /> {post.date}
                    </span>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="link" className="p-0 h-auto text-primary font-semibold text-sm group/btn">
                        Read More <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-20 glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border-primary/20 bg-primary/[0.03]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Weekly Newsletter</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-['Playfair_Display'] mb-4">Get the <span className="gold-text">Edge</span> in Your Inbox</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join 1,200+ serious traders receiving our weekly deep dives into EA validation, risk management, and prop firm strategies.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6">Subscribe Free</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime. Read by 1,200+ traders.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
