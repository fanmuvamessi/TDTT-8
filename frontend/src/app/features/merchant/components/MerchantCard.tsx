// src/app/features/merchant/components/MerchantCard.tsx
import { Card, CardMedia, CardContent, Typography, Stack, Chip, Box } from "@mui/material";
import { LocationOn, Star } from "@mui/icons-material";
import { Merchant } from "../../../types";

interface Props {
  merchant: Merchant;
  onClick: () => void;
}

export const MerchantCard = ({ merchant, onClick }: Props) => (
  <Card onClick={onClick} sx={{ borderRadius: 4, cursor: "pointer", border: "1px solid #e2e8f0" }}>
    <CardMedia component="img" height="180" image={merchant.coverImageUrl} alt={merchant.name} />
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{merchant.name}</Typography>
      <Stack direction="row" alignItems="center" sx={{ color: "text.secondary", mt: 1 }}>
        <LocationOn sx={{ fontSize: 16 }} />
        <Typography variant="caption">{merchant.address}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
        <Star sx={{ fontSize: 16, color: "#ffb703" }} />
        <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5 }}>{merchant.rating_avg}</Typography>
      </Stack>
    </CardContent>
  </Card>
);