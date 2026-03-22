import React, { useEffect } from 'react';

interface HubSpotFormProps {
  portalId: string;
  formId: string;
  region?: string;
}

const HubSpotForm: React.FC<HubSpotFormProps> = ({ portalId, formId, region = 'na2' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://js-${region}.hsforms.net/forms/embed/${portalId}.js`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          region: region,
          portalId: portalId,
          formId: formId,
          target: '#hubspot-form-container'
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [portalId, formId, region]);

  return (
    <div id="hubspot-form-container" className="hubspot-form-wrapper min-h-[400px] w-full">
      {/* Form will be injected here */}
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-pulse text-muted-foreground">Loading form...</div>
      </div>
    </div>
  );
};

export default HubSpotForm;
