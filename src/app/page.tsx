'use client';

import { useState, useEffect } from 'react';
import { MARKETS } from '@/lib/markets';
import { MarketCode } from '@/lib/types';

type TemplateType = 'order-confirmation' | 'order-bank-transfer' | 'payment-confirmed' | 'order-shipped';

const TEMPLATE_OPTIONS: { value: TemplateType; label: string; description: string }[] = [
  { value: 'order-confirmation', label: 'Potvrzeni objednavky', description: 'Email 1 - ihned po objednavce (vsem)' },
  { value: 'order-bank-transfer', label: 'Ceka se na platbu', description: 'Email 2a - bankovni prevod' },
  { value: 'payment-confirmed', label: 'Platba potvrzena', description: 'Email 2b - karta nebo prevod prijat' },
  { value: 'order-shipped', label: 'Objednavka odeslana', description: 'Email 3 - zasilka odeslana' },
];

interface ProductData {
  sku: string;
  name: string;
  prices: Record<string, number>;
}

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState<MarketCode>('cs');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('order-confirmation');
  const [products, setProducts] = useState<ProductData[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [templateSize, setTemplateSize] = useState<number>(0);
  const [showPrices, setShowPrices] = useState(false);

  // Fetch products from Baselinker on load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Generate preview when market or template changes
  useEffect(() => {
    if (products.length > 0) {
      generatePreview();
    }
  }, [selectedMarket, selectedTemplate, products, showPrices]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setStatus({
          type: data.source === 'baselinker' ? 'success' : 'error',
          message: data.source === 'baselinker' 
            ? 'Ceny načteny z Baselinker' 
            : 'Použity záložní ceny',
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setStatus({ type: 'error', message: 'Chyba při načítání produktů' });
    }
  };

  const generatePreview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: selectedMarket,
          templateType: selectedTemplate,
          products,
          showPrices,
        }),
      });
      
      const data = await response.json();
      
      if (data.html) {
        setPreviewHtml(data.html);
        setTemplateSize(data.size);
      }
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!previewHtml) return;

    // Add UTF-8 BOM to ensure proper encoding recognition
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + previewHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}-${selectedMarket}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    if (!previewHtml) return;
    
    try {
      await navigator.clipboard.writeText(previewHtml);
      setStatus({ type: 'success', message: 'Zkopírováno do schránky!' });
      setTimeout(() => setStatus(null), 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Kopírování selhalo' });
    }
  };

  const currentMarket = MARKETS.find(m => m.code === selectedMarket);
  const currentTemplate = TEMPLATE_OPTIONS.find(t => t.value === selectedTemplate);

  return (
    <div className="container">
      <header className="header">
        <h1>🦘 Springfree Email Generator</h1>
        {status && (
          <span className={`status ${status.type === 'error' ? 'error' : ''}`}>
            {status.message}
          </span>
        )}
      </header>

      <div className="main-grid">
        <aside className="sidebar">
          <h2>Typ emailu</h2>
          <div className="template-list" style={{ marginBottom: '20px' }}>
            {TEMPLATE_OPTIONS.map((template) => (
              <button
                key={template.value}
                className={`market-btn ${selectedTemplate === template.value ? 'active' : ''}`}
                onClick={() => setSelectedTemplate(template.value)}
                style={{ marginBottom: '8px' }}
              >
                <span className="flag" style={{ fontSize: '16px' }}>
                  {template.value === 'order-confirmation' ? '📦' : template.value === 'order-bank-transfer' ? '🏦' : template.value === 'payment-confirmed' ? '✅' : '🚚'}
                </span>
                <span className="info">
                  <span className="name">{template.label}</span>
                  <span className="currency">{template.description}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="divider" />

          <h2>Vyberte trh</h2>
          <div className="market-list">
            {MARKETS.map((market) => (
              <button
                key={market.code}
                className={`market-btn ${selectedMarket === market.code ? 'active' : ''}`}
                onClick={() => setSelectedMarket(market.code)}
              >
                <span className="flag">{market.flag}</span>
                <span className="info">
                  <span className="name">{market.name}</span>
                  <span className="currency">{market.language} • {market.currency}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="divider" />

          <div className="price-info">
            <strong>Upsell produkty:</strong><br />
            4 pevné produkty s cenami z Baselinker
          </div>

          <div style={{ margin: '20px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
              <input 
                type="checkbox" 
                checked={showPrices} 
                onChange={(e) => setShowPrices(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Zobrazit ceny produktů
            </label>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', marginLeft: '24px' }}>
              {showPrices ? '⚠️ Ceny budou v HTML "natvrdo".' : '✅ Doporučeno pro Baselinker.'}
            </p>
          </div>

          <div className="divider" />

          <button 
            className="export-btn" 
            onClick={handleCopyToClipboard}
            disabled={!previewHtml || loading}
            style={{ marginBottom: '10px' }}
          >
            📋 Kopírovat do schránky
          </button>

          <button
            className="export-btn"
            onClick={handleExport}
            disabled={!previewHtml || loading}
            style={{ background: '#64748b' }}
          >
            💾 Stáhnout HTML
          </button>

          <div style={{ marginTop: '20px', padding: '12px', background: '#dcfce7', borderRadius: '8px', fontSize: '12px' }}>
            <strong>✅ Připraveno pro Baselinker</strong>
            <p style={{ margin: '8px 0 0 0', color: '#166534', fontSize: '11px' }}>
              Šablona obsahuje <code style={{ background: '#fff', padding: '2px 4px', borderRadius: '3px' }}>[seznam_položek()]</code> - stačí zkopírovat a vložit.
            </p>
          </div>

          {templateSize > 0 && (
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
              Velikost: {templateSize.toLocaleString()} / 25 000 znaků
              {templateSize > 25000 && <span style={{ color: '#ef4444' }}> ⚠️ Překročen limit!</span>}
            </p>
          )}
        </aside>

        <main className="preview-container">
          <div className="preview-header">
            <h3>
              {currentTemplate?.label} • {currentMarket?.flag} {currentMarket?.name} ({currentMarket?.currency})
            </h3>
            {loading && <span className="status">Generuji...</span>}
          </div>
          
          {previewHtml ? (
            <iframe
              className="preview-frame"
              srcDoc={previewHtml}
              title="Email Preview"
              sandbox="allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="loading">
              Načítám...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
