import { Outlet, useLocation, useNavigate } from "react-router";
import { BottomNavigation, BottomNavigationAction, Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Home, VideoLibrary, Map as MapIcon, Person, Logout } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getActiveTab = () => {
    if (location.pathname === "/") return 0;
    if (location.pathname === "/videos") return 1;
    if (location.pathname === "/map") return 2;
    if (location.pathname === "/profile") return 3;
    return 0;
  };

  const handleNavigation = (_event: React.SyntheticEvent, newValue: number) => {
    const paths = ["/", "/videos", "/map", "/profile"];
    navigate(paths[newValue]);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      
      {/* 1. LOGO LUÔN NẰM GÓC TRÁI TRÊN CÙNG (Dùng position: absolute) */}
      <Box 
        sx={{ 
          position: "absolute", 
          top: 16, 
          left: 16, 
          zIndex: 1000 // Đảm bảo luôn nằm trên các nội dung khác
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 900, 
            color: "#ff6b35", 
            textShadow: "0 1px 2px rgba(0,0,0,0.5)" 
          }}
        >
          FoodSpot
        </Typography>
      </Box>

      {/* 2. Phần nội dung (Outlet) - Đã đổi sang màu nền tối sâu */}
      {/* 2. Phần nội dung (Outlet) - ĐÃ CẬP NHẬT ĐỂ SỬA LỖI KHÔNG CUỘN ĐƯỢC HOME */}
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1, 
          height: 0, 
          // ĐÃ SỬA: Đổi từ "hidden" thành "auto" để kích hoạt lại thanh cuộn cho các trang dài như HomePage
          overflow: "auto", 
          bgcolor: "#000000", 
          position: "relative"
        }}
      >
        <Outlet />
      </Box>

      {/* 3. Thanh điều hướng dưới cùng - Đã đổi sang Đen hoàn toàn và tiệp màu Cam */}
      <BottomNavigation
        value={getActiveTab()}
        onChange={handleNavigation}
        showLabels
        sx={{
          bgcolor: "#121212", // Màu nền đen cho thanh dưới
          borderTop: "1px solid #2d2d2d", // Viền mờ ngăn cách phía trên thanh
          "& .MuiBottomNavigationAction-root": {
            color: "#ffffff", // Màu sắc các icon/chữ lúc chưa được chọn
          },
          "& .Mui-selected": {
            color: "#ff6b35 !important", // Màu cam đặc trưng khi icon được click chọn
          },
          "& .MuiBottomNavigationAction-label.Mui-selected": {
            color: "#ff6b35 !important", // Đảm bảo chữ cũng chuyển màu cam đồng bộ
          }
        }}
      >
        <BottomNavigationAction label="Trang chủ" icon={<Home />} />
        <BottomNavigationAction label="Video" icon={<VideoLibrary />} />
        <BottomNavigationAction label="Bản đồ" icon={<MapIcon />} />
        <BottomNavigationAction label="Hồ sơ" icon={<Person />} />
      </BottomNavigation>
    </Box>
  );
}