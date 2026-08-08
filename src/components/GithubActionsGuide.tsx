import React, { useState } from 'react';
import { Github, Copy, Check, ExternalLink, Zap, ShieldAlert } from 'lucide-react';

export const GithubActionsGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const actionYaml = `name: Deploy Tamil Audiobook Application to GitHub Pages

on:
  push:
    branches: ["main", "master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci || npm install

      - name: Build static site for GitHub Pages
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const copyYaml = () => {
    navigator.clipboard.writeText(actionYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-emerald-400" />
              <span>Automated GitHub Pages Deployment (.github/workflows/deploy.yml)</span>
            </h2>
            <p className="text-xs text-slate-400">
              இந்த GitHub Action மூலமாக தாங்கள் Git Push செய்தவுடன் தன்னிச்சையாக GitHub Pages-ல் இணையதளம் வெளியாகும்.
            </p>
          </div>

          <button
            onClick={copyYaml}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all self-start md:self-auto"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Workflow எடுத்தாச்சு' : 'deploy.yml பிரதி எடு'}</span>
          </button>
        </div>

        {/* Steps Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-serif">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">1</span>
            <h3 className="font-bold text-white">களஞ்சியம் அமைத்தல் (Repository)</h3>
            <p className="text-slate-400">
              இந்த அனைத்துக் கோப்புகளையும் தங்களுடைய GitHub களஞ்சியத்தில் Push செய்க (`git push origin main`).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="font-bold text-white">Pages அமைப்பை இயக்குக</h3>
            <p className="text-slate-400">
              GitHub Repo -&gt; Settings -&gt; Pages -&gt; Source என்பதின் கீழ் <strong className="text-emerald-300">"GitHub Actions"</strong> எனத் தேர்ந்தெடுக்கவும்.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">3</span>
            <h3 className="font-bold text-white">தானியங்கி வெளியீடு</h3>
            <p className="text-slate-400">
              `deploy.yml` Action தன்னிச்சையாக இயங்கி உங்கள் தளத்தை இலவசமாக நேரலையில் (Live Pages URL) வழங்கும்.
            </p>
          </div>
        </div>

        {/* Display Workflow YAML */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold text-slate-400">
            .github/workflows/deploy.yml
          </div>
          <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto max-h-[380px] custom-scrollbar">
            <code>{actionYaml}</code>
          </pre>
        </div>

      </div>

    </div>
  );
};
