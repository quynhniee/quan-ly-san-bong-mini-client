import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  Form,
  FormLayout,
  Modal,
  Grid,
} from "@shopify/polaris";
import { Category, ImportOrderProduct, Product } from "../../interface";
import ClientCtr from '../../ClientCtr';

interface AddOrderProductDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateItem: (orderProduct: ImportOrderProduct, id?: number) => void;
  data: ImportOrderProduct | undefined;
}

const AddOrderProductDialog: React.FC<AddOrderProductDialogProps> = ({
  open,
  setOpen,
  handleUpdateItem,
  data,
}: AddOrderProductDialogProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>(data?.product);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<number>(
    data?.product?.category?.id || 1
  );
  const [displayProducts, setDisplayProducts] = useState<Product[]>(
    data?.id ? [data?.product] : []
  );
  console.log(data?.product.price)
  const [importPrice, setImportPrice] = useState<number>(data?.product.price || 0)
  const [quantity, setQuantity] = useState<number>(data?.quantity || 0)

  const fetchProductsData = async () => {
    if (category) {
      const response = await ClientCtr.getProductByCategory(category)
  
      const newProducts = response?.data
      setProducts(newProducts);
      setDisplayProducts(newProducts);
      setProduct(newProducts[0]);
      setImportPrice(newProducts[0].price)
    }
  };

  const fetchCategoriesData = async () => {
    await ClientCtr.getAllCategories().then((response) => {
      setCategories(response?.data)
      if (!data) setCategory(response?.data[0].id.toString())
    })
  };

  useEffect(() => {
    fetchProductsData();
  }, [category]);

  useEffect(() => {
    fetchProductsData();
    fetchCategoriesData();
  }, []);

  const handleChangeProduct = (value: string) => {
    const selectedProduct = products.find(
      (item: Product) => item.id === parseInt(value)
    );
    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  };

  const handleChangeCategory = (value: string) => {
    setCategory(+value);
  };

  const onSubmitHandle = () => {
    if (product && quantity > 0 && importPrice > 0) {
      const newOrder = {
        id: data?.id || undefined,
        importPrice,
        product,
        quantity
      }
      handleUpdateItem(newOrder, data?.id)
    }
  }

  return (
    <Modal
      size="small"
      open={open}
      onClose={() => setOpen(false)}
      title={data?.id ? "Sửa thông tin mặt hàng" : "Thêm Mặt Hàng"}
      primaryAction={{
        content: data?.id ? "Lưu" : "Thêm",
        onAction: onSubmitHandle,
      }}
      secondaryActions={[
        {
          content: "Hủy",
          onAction: () => setOpen(false),
        },
      ]}
    >
      <Form onSubmit={onSubmitHandle}>
        <Modal.Section>
          <FormLayout>
            <Select
              id="select-category"
              label="Chọn loại mặt hàng"
              options={categories.map((item: Category) => ({
                label: item.name,
                value: item.id.toString(),
              }))}
              value={category?.toString()}
              onChange={(value) => handleChangeCategory(value as string)}
              disabled={data?.id ? true : false}
            />
            <Select
              id="select-product"
              label="Chọn mặt hàng"
              options={displayProducts.map((item: Product) => ({
                label: item.name,
                value: item.id ? item.id.toString() : "",
              }))}
              value={product?.id?.toString() || ""}
              onChange={(value) => handleChangeProduct(value as string)}
              disabled={data?.id ? true : false}
            />
             <TextField
              id="importPrice"
              label="Giá"
              type="number"
              value={importPrice.toString()}
              onChange={value => setImportPrice(+value)}
              autoComplete="off"
            />
            <TextField
              id="quantity"
              label="Số Lượng"
              type="number"
              min={1}
              value={ quantity.toString()
              }
              onChange={(value) => setQuantity(+value)}
              disabled={!category}
              autoComplete="off"
            />
           
          </FormLayout>
        </Modal.Section>
      </Form>
    </Modal>
  );
};

export default AddOrderProductDialog;
