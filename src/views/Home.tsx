import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import React from "react";
import { Link } from "react-router-dom";

const pages = [
  { name: "Mặt hàng", path: "/products" },
  { name: "Đơn nhập hàng", path: "/orders" },
  { name: "Nhà cung cấp", path: "/suppliers" },
];
const Home = () => {
  return (
    <>
      <Page
        title="Trang chủ"
      >
        <Card>
          <InlineStack gap="1000">
            <Text as="h2" variant="headingSm">
              Đi tới
            </Text>
            <BlockStack gap={"500"} align='center'  >
              {pages.map((page) => (
                <Link to={page.path} style={{ textDecoration: "none" }}>
                  <Button size='large' key={page.name}>{page.name}</Button>
                </Link>
              ))}
            </BlockStack>
          </InlineStack>
        </Card>
       
      </Page>
    </>
  );
};

export default Home;
