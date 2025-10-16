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
import CategoryCaPhe from "../pages/category-caphe";
import CategoryTra from "../pages/category-tra";
import CategorySuaTuoi from "../pages/category-suatuoi";
import CategoryDoAn from "../pages/category-doan";
import CategoryCombo from "../pages/category-combo";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/category/caphe" element={<CategoryCaPhe />} />
            <Route path="/category/tra" element={<CategoryTra />} />
            <Route path="/category/suatuoi" element={<CategorySuaTuoi />} />
            <Route path="/category/doan" element={<CategoryDoAn />} />
            <Route path="/category/combo" element={<CategoryCombo />} />
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
