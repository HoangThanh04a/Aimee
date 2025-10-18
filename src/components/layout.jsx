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
import CategoryCaphePage from "../pages/category-caphe";
import CategoryTraPage from "../pages/category-tra";
import CategoryTraSuaPage from "../pages/category-tra-sua";
import CategoryBanhPage from "../pages/category-banh";
import CategoryToppingPage from "../pages/category-topping";
import CategoryPage from "../pages/CategoryPage";

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
            <Route path="/caphe" element={<CategoryCaphePage />} />
            <Route path="/tra" element={<CategoryTraPage />} />
            <Route path="/tra-sua" element={<CategoryTraSuaPage />} />
            <Route path="/banh" element={<CategoryBanhPage />} />
            <Route path="/topping" element={<CategoryToppingPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
