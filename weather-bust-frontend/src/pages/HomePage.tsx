import React, { useState } from 'react'
import {
  CloudRain,
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  Info,
} from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  StatusIndicator,
  Input,
  Select,
  Divider,
  Tooltip,
  Modal,
} from '../components/ui'


export const HomePage: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('all')

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Restrained Professional Welcome Section */}
      <section className="bg-gradient-to-br from-[#0b172a] to-[#10213d] border border-[#1a2e4c] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-black/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sky" size="sm">
              <CloudRain className="w-3 h-3 inline mr-1" />
              Stage 3 Complete
            </Badge>
            <Badge variant="outline" size="sm">
              Mock Data Architecture (1,764 Records Ready)
            </Badge>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Weather Intelligence
            </h1>
            <p className="text-base sm:text-lg font-medium text-sky-400">
              Forecast Bust Detection &amp; Monitoring
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Monitor forecast uncertainty, detect potential forecast busts, and explore rainfall
            forecast risk across spatial domains and model horizons.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => setIsDemoModalOpen(true)}
            >
              Verify System Shell
            </Button>
            <Tooltip content="Explore established design tokens & component library" position="top">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => {
                  const el = document.getElementById('design-system-preview')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Inspect Design System
              </Button>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Semantic Risk Hierarchy Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Semantic Risk Calibration
            </h2>
            <p className="text-xs text-slate-400">
              Controlled color scales established for meteorological variance and bust alerts
            </p>
          </div>
          <Badge variant="default" size="sm">
            Standard ISO/Meteorological Scale
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Low Risk */}
          <Card className="border-emerald-500/30 bg-[#0b172a]/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusIndicator status="low" label="Low Risk" />
                <Badge variant="low" size="sm">
                  Normal
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">
                Forecast variance within calibrated confidence bounds (≤ 10mm deviation).
              </p>
            </CardContent>
          </Card>

          {/* Moderate Risk */}
          <Card className="border-amber-500/30 bg-[#0b172a]/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusIndicator status="moderate" label="Moderate Risk" />
                <Badge variant="moderate" size="sm">
                  Elevated
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">
                Emerging ensemble spread or localized boundary layer discrepancies (10-25mm).
              </p>
            </CardContent>
          </Card>

          {/* High Risk */}
          <Card className="border-orange-500/30 bg-[#0b172a]/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusIndicator status="high" label="High Risk" />
                <Badge variant="high" size="sm">
                  Severe Spread
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">
                Substantial model bifurcation or uncaptured convective precipitation (25-50mm).
              </p>
            </CardContent>
          </Card>

          {/* Severe Risk */}
          <Card className="border-red-500/30 bg-[#0b172a]/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusIndicator status="severe" label="Severe Risk" />
                <Badge variant="severe" size="sm">
                  Critical Bust
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">
                Catastrophic forecast bust threshold exceeded (&gt; 50mm extreme variance).
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Component Library & Architecture Verification */}
      <section id="design-system-preview" className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Reusable Component Foundation
          </h2>
          <p className="text-xs text-slate-400">
            Base building blocks built for future analytics, charts, maps, and exploration pages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls & Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Interactive Elements &amp; Inputs</span>
              </CardTitle>
              <CardDescription>
                Consistent sizing, subtle borders, focus-ring states, and accessible semantics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  leftIcon={<Search className="w-4 h-4" />}
                  placeholder="Filter station..."
                  defaultValue=""
                  aria-label="Filter station"
                />
                <Select
                  options={[
                    { label: 'All Spatial Regions', value: 'all' },
                    { label: 'Northern Plains', value: 'north' },
                    { label: 'Coastal Belt', value: 'coastal' },
                    { label: 'Western Ghats', value: 'west' },
                  ]}
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  aria-label="Spatial Region selection"
                />
              </div>

              <Divider label="Button Variants" />

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" size="sm">
                  Primary
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
                <Button variant="danger" size="sm">
                  Alert
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Architectural Separation & Guardrails */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Architecture &amp; Independence Guardrails</span>
              </CardTitle>
              <CardDescription>
                Zero coupling with legacy Python models or NetCDF files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-[#060d19] border border-[#1a2e4c] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Environment Decoupling:</span>
                  <span className="text-emerald-400 font-mono font-medium">100% Isolated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Old Codebase Import:</span>
                  <span className="text-emerald-400 font-mono font-medium">None (0 files)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Styling Architecture:</span>
                  <span className="text-sky-400 font-mono font-medium">Tailwind v4 + Tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mock Data Layer:</span>
                  <span className="text-emerald-400 font-mono font-medium">1,764 Records (Validated)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Feature pages (explorer, map, bust detection) remain unbuilt until designated
                  stages.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modal Dialog Verification */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Application Shell Verification"
        description="Verification modal demonstrating dialog foundation, backdrop, and keyboard escape handling."
        footer={
          <Button variant="secondary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            The application shell, navigation drawer, theme provider, and design system components
            are fully initialized and operational.
          </p>
          <div className="p-3 rounded-lg bg-[#060d19] border border-[#1a2e4c] space-y-1">
            <div className="text-slate-400">Shell Features Active:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-200">
              <li>Responsive Left Sidebar with Category Hierarchy</li>
              <li>Top Header with Breadcrumbs, Search, &amp; Profile Area</li>
              <li>Theme Foundation with Dark/Light Support</li>
              <li>Mobile Navigation Drawer with Backdrop</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  )
}
