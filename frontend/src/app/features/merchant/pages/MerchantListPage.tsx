// src/app/features/merchant/pages/MerchantListPage.tsx
import { Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockHomeMerchants } from "../../content/mock-data"; // Import đúng file mock
import { MerchantCard } from "../components/MerchantCard";

export default function MerchantListPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 800 }}>QUÁN ĂN NỔI BẬT</Typography>
      <Grid container spacing={3}>
        {mockHomeMerchants.map((merchant) => (
          <Grid size={{ xs: 12, sm: 6 }} key={merchant.id}>
            <MerchantCard 
              merchant={merchant} 
              onClick={() => navigate(`/merchants/${merchant.id}`)} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}