'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import type { Trail } from '../../types';
import { clampProgress } from '../../utils';
import { tokens } from '../../lib/tokens';

interface ProgressCardProps {
  trail: Trail;
  /** Optional click handler — when provided the whole card becomes a button. */
  onOpen?: (trailId: string) => void;
}

/**
 * Compact, accessible progress summary for a single trail.
 * Extracted from the dashboard / progresso pages, which repeat this pattern.
 */
export default function ProgressCard({ trail, onOpen }: ProgressCardProps) {
  const value = clampProgress(trail.progress);
  const interactive = typeof onOpen === 'function';

  return (
    <Box
      role={interactive ? 'button' : 'group'}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`${trail.title} — ${value}% concluído`}
      onClick={interactive ? () => onOpen?.(trail.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen?.(trail.id);
              }
            }
          : undefined
      }
      sx={{
        display: 'flex',
        gap: 1.75,
        alignItems: 'center',
        p: 2,
        bgcolor: tokens.bg[3],
        border: `1px solid ${tokens.line.default}`,
        borderRadius: '12px',
        cursor: interactive ? 'pointer' : 'default',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          bgcolor: `${trail.color}22`,
          border: `1px solid ${trail.color}44`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: trail.color }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {trail.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2], flexShrink: 0, ml: 1 }}>
            {value}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={value}
          aria-label={`Progresso de ${trail.title}`}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: tokens.line.strong,
            '& .MuiLinearProgress-bar': { bgcolor: trail.color, borderRadius: 2 },
          }}
        />
        <Typography sx={{ fontSize: 11, color: tokens.text[2], mt: 0.75 }}>
          {trail.lessonsDone} de {trail.lessonsTotal} aulas
        </Typography>
      </Box>
    </Box>
  );
}
