'use client';

import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useStore } from '../../store/useStore';

interface FavoriteButtonProps {
  trailId: string;
  trailTitle: string;
}

/** Toggles a trail's favorite state. Accessible via aria-pressed + dynamic label. */
export default function FavoriteButton({ trailId, trailTitle }: FavoriteButtonProps) {
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const active = favorites.includes(trailId);

  return (
    <IconButton
      size="small"
      aria-pressed={active}
      aria-label={
        active ? `Remover ${trailTitle} dos favoritos` : `Adicionar ${trailTitle} aos favoritos`
      }
      onClick={() => toggleFavorite(trailId)}
      sx={{ color: active ? 'primary.main' : 'text.secondary' }}
    >
      {active ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
    </IconButton>
  );
}
