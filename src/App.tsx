import "@shopify/polaris/build/esm/styles.css";
import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import HeaderBar from "./components/HeaderBar";
import CustomSkeletonPage from "./components/Skeleton/skeleton-page";

const Home = React.lazy(() => import("./views/Home"));
const ProductPage = React.lazy(() => import("./views/product"));
const OrdersPage = React.lazy(() => import("./views/order"));
const SupplierPage = React.lazy(() => import("./views/supplier"));

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <Router>
        <div>
          <HeaderBar />
          <Suspense fallback={<CustomSkeletonPage/>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/suppliers" element={<SupplierPage/>}/>
              <Route path="/products" element={<ProductPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
