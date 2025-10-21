import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";

import HomePage from "../pages/index";
import NotificationPage from "../pages/notification";
import CartPage from "../pages/cart";
import ProfilePage from "../pages/profile";
import CategoryPage from "../pages/CategoryPage";
import BottomNavigation from "./BottomNavigation";
import { UserProvider } from "../context/UserContext";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <UserProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage />} />
              <Route path="/notification" element={<NotificationPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Single dynamic category route */}
              <Route path="/category/:categoryId" element={<CategoryPage />} />
            </AnimationRoutes>
            <BottomNavigation />
          </ZMPRouter>
        </UserProvider>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
