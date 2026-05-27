// src/app/pages/home/HomePage.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Grid, Card, CardMedia, CardContent, Avatar, Button, Paper, TextField, InputAdornment } from "@mui/material";
import { Search, LocalFireDepartment, LocationOn, Star, Campaign, DoubleArrow, Fastfood } from "@mui/icons-material";
import { mockVideos, mockHomeMerchants, mockCampaigns } from "../mock-data";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setVideos(mockVideos);
    setMerchants(mockHomeMerchants);
    setCampaigns(mockCampaigns);
  }, []);

  // Reset khi xóa trắng ô tìm kiếm
  useEffect(() => {
    if (searchTerm === "") {
      setQuery("");
      setIsSearching(false);
    }
  }, [searchTerm]);

  const filteredMerchants = merchants.filter((m) =>
    query === "" || 
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.menu?.some((item: any) => item.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto", px: { xs: 2, sm: 4 }, pt: 10, pb: 6, bgcolor: "#000000", minHeight: "100vh", overflowY: "auto" }}>
      <Stack spacing={5} sx={{ maxWidth: 800, mx: "auto" }}>
        
        <TextField
          fullWidth
          placeholder="Tìm quán ăn, món ăn... rồi nhấn Enter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { 
            if (e.key === 'Enter') {
              setQuery(searchTerm);
              setIsSearching(true);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><Search sx={{ color: "#718096" }} /></InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": { bgcolor: "#111111", borderRadius: 3, color: "white", "& fieldset": { borderColor: "#1e1e1e" }, "&:hover fieldset": { borderColor: "#ff6b35" }, "&.Mui-focused fieldset": { borderColor: "#ff6b35" } },
          }}
        />

        {!isSearching && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Campaign sx={{ color: "#ffb703", fontSize: 22 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.5px" }}>GỢI Ý HÔM NAY</Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { height: 4 } }}>
              {campaigns.map((cp) => (
                <Paper key={cp.id} sx={{ minWidth: { xs: 280, sm: 340 }, height: 160, position: "relative", borderRadius: 4, overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
                  <CardMedia component="img" image={cp.thumbnail_url} sx={{ height: "100%", width: "100%", objectFit: "cover" }} />
                  <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2, background: "linear-gradient(transparent, rgba(0,0,0,0.9))" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{cp.title}</Typography>
                    <Typography variant="caption" sx={{ color: "#ffb703", fontWeight: 600, display: "block", mt: 0.5 }}>Sponsored ⚡</Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn sx={{ color: "#ff6b35", fontSize: 22 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.5px" }}>
                {isSearching ? `KẾT QUẢ CHO: "${query.toUpperCase()}"` : "QUÁN NGON SÁT VÁCH"}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            {filteredMerchants.length > 0 ? (
              filteredMerchants.map((m) => (
                <Card 
                  key={m.id} 
                  onClick={() => navigate(`/merchants/${m.id}`)}
                  sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "#111111", border: "1px solid #1e1e1e", borderRadius: 3, boxShadow: "none", cursor: "pointer", "&:hover":{ borderColor: "#ff6b35" } }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: "#ff6b35", width: 40, height: 40 }}><Fastfood sx={{ fontSize: 20 }} /></Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#fff" }}>{m.name}</Typography>
                      <Typography variant="caption" sx={{ color: "#718096", display: "block" }}>{m.address}</Typography>
                    </Box>
                  </Stack>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: "#718096", textAlign: "center", mt: 2 }}>Không tìm thấy quán nào...</Typography>
            )}
          </Stack>
        </Box>

        {!isSearching && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <LocalFireDepartment sx={{ color: "#ff6b35", fontSize: 22 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.5px" }}>XU HƯỚNG REVIEW VIDEO</Typography>
            </Stack>
            <Grid container spacing={2}>
              {videos.map((vid) => (
                <Grid size={{ xs: 6, sm: 4 }} key={vid.id}>
                  <Card sx={{ borderRadius: 4, bgcolor: "#111111", border: "1px solid #1e1e1e", boxShadow: "none", cursor: "pointer", overflow: "hidden" }}>
                    <Box sx={{ position: "relative", pt: "130%" }}>
                      <CardMedia component="img" image={vid.thumbnail_url} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600 }}>{vid.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>
    </Box>
  );
}