// src/app/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Paper, Chip, Divider, LinearProgress, keyframes } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';

// --- انیمیشن‌ها ---
const pulse = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// --- المان ۱: چراغ LED صنعتی ---
const IndustrialLED = ({ color, label, active = true }: any) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
    <Box sx={{
      width: 14, height: 14,
      bgcolor: active ? color : '#1a1a1a',
      boxShadow: active ? `0 0 15px ${color}` : 'none',
      border: '2px solid #000',
      animation: active ? `${pulse} 2s infinite` : 'none'
    }} />
    <Typography variant="caption" sx={{ color: active ? '#fff' : '#333', fontSize: '0.7rem', fontWeight: 'bold' }}>
      {label}
    </Typography>
  </Stack>
);

// --- المان ۲: نوار قلب (Heartbeat) ---
const HeartbeatMonitor = () => (
  <Box sx={{ width: '100%', height: 100, position: 'relative', bgcolor: '#000', border: '1px solid #00e5ff33', overflow: 'hidden' }}>
    <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
      <path
        d="M0 50 L40 50 L45 10 L55 90 L60 50 L100 50 L105 5 L115 95 L120 50 L200 50"
        fill="none"
        stroke="#00e5ff"
        strokeWidth="2"
      >
        <animate attributeName="stroke-dasharray" from="0, 200" to="200, 0" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 229, 255, 0.05) 3px)' }} />
  </Box>
);

// --- المان ۳: گیج آنالوگ (Circular Gauge) ---
const AnalogGauge = ({ label, value, color }: any) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box sx={{ width: 80, height: 80, borderRadius: '50%', border: `4px double ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: color, fontWeight: '900', fontFamily: 'monospace' }}>{value}%</Typography>
      </Box>
      <SpeedIcon sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', color: color, fontSize: 20 }} />
    </Box>
    <Typography variant="caption" sx={{ display: 'block', mt: 1, letterSpacing: 1 }}>{label}</Typography>
  </Box>
);

export default function DashboardPage() {
  const [logs, setLogs] = useState<string[]>(["Initializing Core_OS...", "Kernel Secure.", "Nodes Synced."]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `> [${new Date().toLocaleTimeString()}] SAGA_EVENT: CID-${Math.random().toString(16).slice(2, 8).toUpperCase()} PROCESSED.`;
      setLogs(prev => [newLog, ...prev.slice(0, 4)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ 
      p: 4, bgcolor: '#020617', minHeight: '100vh', position: 'relative', overflow: 'hidden',
      '&::before': { // افکت خطوط اسکن مانیتور
        content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), Array(20).join("0") line-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        zIndex: 10, pointerEvents: 'none', backgroundSize: '100% 4px, 3px 100%'
      }
    }}>
      
      <Stack spacing={4}>
        {/* HEADER: MISSION STATUS */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" color="primary" sx={{ fontWeight: '900', letterSpacing: 4 }}>
              OPERATIONS_TERMINAL
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Chip icon={<SecurityIcon sx={{ fontSize: '12px !important' }}/>} label="ACCESS_LEVEL: ALPHA" size="small" variant="outlined" color="secondary" />
              <Chip icon={<MemoryIcon sx={{ fontSize: '12px !important' }}/>} label="NODE: DE_FRANKFURT_01" size="small" variant="outlined" />
            </Stack>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #00e5ff44', textAlign: 'right' }}>
            <Typography variant="caption" color="primary" sx={{ display: 'block' }}>SYSTEM_TIME</Typography>
            <Typography variant="h5" sx={{ fontFamily: 'monospace' }}>{new Date().toLocaleTimeString()}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ bgcolor: '#00e5ff33', height: 2 }} />

        {/* ANALOG GAUGES ROW */}
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-around', bgcolor: 'rgba(0,229,255,0.02)' }}>
          <AnalogGauge label="CPU_LOAD" value="42" color="#00e5ff" />
          <AnalogGauge label="MEM_USAGE" value="68" color="#ff9100" />
          <AnalogGauge label="NETWORK_I/O" value="14" color="#4caf50" />
          <AnalogGauge label="DISK_BUFFER" value="22" color="#00e5ff" />
        </Paper>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          
          {/* MAIN MONITOR: SAGA HEARTBEAT */}
          <Paper sx={{ flex: 2, p: 3, position: 'relative' }}>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}>
              REAL-TIME_EVENT_FLOW_MONITOR
            </Typography>
            <HeartbeatMonitor />
            <Box sx={{ mt: 3, p: 2, bgcolor: '#000', border: '1px solid #333' }}>
              <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>CONSOLE_OUTPUT</Typography>
              {logs.map((log, i) => (
                <Typography key={i} variant="caption" sx={{ display: 'block', fontFamily: 'monospace', color: i === 0 ? '#00e5ff' : '#444' }}>
                  {log}
                </Typography>
              ))}
            </Box>
          </Paper>

          {/* SIDE PANEL: SERVICE MATRIX */}
          <Paper sx={{ flex: 1, p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>SERVICE_MATRIX</Typography>
              <SettingsIcon sx={{ fontSize: 18, animation: `${spin} 4s linear infinite`, color: 'text.secondary' }} />
            </Stack>
            
            <IndustrialLED color="#4caf50" label="CATALOG_DB (MONGODB)" />
            <IndustrialLED color="#4caf50" label="ORDERING_DB (SQL_SERVER)" />
            <IndustrialLED color="#ff9100" label="RABBITMQ_EVENT_BUS" />
            <IndustrialLED color="#00e5ff" label="REDIS_CACHE_CLUSTER" />
            <IndustrialLED color="#4caf50" label="IDENTITY_PROVIDER" />
            
            <Divider sx={{ my: 3, opacity: 0.1 }} />
            
            <Typography variant="caption" color="secondary" sx={{ display: 'block', mb: 2 }}>ALARM_LOGS</Typography>
            <Box sx={{ p: 1, borderLeft: '2px solid #ff9100', bgcolor: 'rgba(255,145,0,0.05)' }}>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                [!] WARN: Latency spike in Frankfurt_01. Saga timeouts increased by 14ms.
              </Typography>
            </Box>
          </Paper>
        </Stack>

        {/* FOOTER: SYSTEM SPECS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.4 }}>
          <Typography variant="caption">OS: CORE_SUPPLY_v8.0.1 // ARCH: x64_DISTRIBUTED</Typography>
          <Typography variant="caption">ENCRYPTION: AES_256_RSA_ENABLED</Typography>
        </Box>

      </Stack>
    </Box>
  );
}
