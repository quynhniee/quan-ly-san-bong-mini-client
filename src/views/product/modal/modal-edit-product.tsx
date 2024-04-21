import {
  BlockStack,
  Box,
  Button,
  Form,
  FormLayout,
  Icon,
  Modal,
  Popover,
  Scrollable,
  Text,
  TextField,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { EModal } from "../../../constants";
import { useModal } from "../../../hook/useModal";
import { Category, Product } from "../../../interface";
import DropZoneImage from "../component/drop-zone-image";
import SelectedMediaCard from "../component/selected-media-card";
import ClientCtr from "../../../ClientCtr";
import { CategoryListItem } from "../CategoryListItem";

const EErrorText = {
  Empty: (name: string) => `${name} không được để trống.`,
  InvalidNumber: (name: string) => `${name} phải là số nguyên.`,
  NumberLessZezo: (name: string) => `${name} phải là số nguyên dương.`,
};

const ProductDetail = () => {
  const { state, openModal, closeModal } = useModal();
  const data = state[EModal.MODAL_EDIT_PRODUCT]?.data || [];
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>();
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    {
      id: data[8] || "",
      name: data[3] || "",
    },
  ]);

  // Fetch product data
  const fetchProduct = async (id: number) => {
    await ClientCtr.getProduct(id)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Fetch all categories data
  const fetchCategory = async () => {
    await ClientCtr.getAllCategories()
      .then((response) => {
        setListCategory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data[0]) {
      setIsLoading(true);
      fetchProduct(data[0])
        .then(() => fetchCategory())
        .then(() => setIsLoading(false));
    } else {
      fetchCategory().then(() => setIsLoading(false));
      setProduct(null);
    }
  }, [data[0]]);

  const id = product?.id;
  const [name, setName] = useState(product?.name || "");
  const [image, setImage] = useState(product?.image || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [description, setDescription] = useState(product?.description);
  const [category, setCategory] = useState({
    id: product?.category?.id || "",
    name: product?.category?.name || "",
  });

  const [isActivePopoverCategory, setIsActivePopoverCategory] = useState(false);

  const [errorNameText, setErrorNameText] = useState("");
  const [errorCategoryText, setErrorCategoryText] = useState("");
  const [errorPriceText, setErrorPriceText] = useState("");
  const [errorQuantityText, setErrorQuantityText] = useState("");

  useEffect(() => {
    setIsLoading(false);
    setName(data[1] || "");
    setImage(data[2] || "");
    setPrice(data[4] || 0);
    setStock(data[5] || 0);
    setDescription(data[6]);
    setCategory({
      id: data[7] || "",
      name: data[3] || "",
    });
    setErrorNameText("");
    setErrorPriceText("");
    setErrorQuantityText("");
    setErrorCategoryText("");
    setSelectedCategories([
      {
        id: data[7] || "",
        name: data[3] || "",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([data])]);

  const handleSaveProduct = async () => {
    let isError = false;
    if (!name) {
      setErrorNameText(EErrorText.Empty("Tên mặt hàng"));
      isError = true;
    } else {
      setErrorNameText("");
    }
    if (!price && Number(price) !== 0) {
      setErrorPriceText(EErrorText.Empty("Giá mặt hàng"));
      isError = true;
    } else if (Number(price) <= 0) {
      setErrorPriceText(EErrorText.NumberLessZezo("Giá mặt hàng"));
      isError = true;
    } else {
      setErrorPriceText("");
    }
    if (!stock && Number(stock) !== 0) {
      setErrorQuantityText(EErrorText.Empty("Số lượng"));
      isError = true;
    } else if (Number(stock) <= 0) {
      setErrorQuantityText(EErrorText.NumberLessZezo("Số lượng"));
      isError = true;
    } else if (Number(stock) !== Math.floor(stock)) {
      setErrorQuantityText(EErrorText.InvalidNumber("Số lượng"));
      isError = true;
    } else {
      setErrorQuantityText("");
    }
    if (!category.name) {
      setErrorCategoryText(EErrorText.Empty("Loại mặt hàng"));
      isError = true;
    } else {
      setErrorCategoryText("");
    }

    if (isError) {
      return isError;
    }

    let newCategory: any = category;

    const data: any = {
      name,
      image,
      stock,
      price,
      description,
      category: { id: newCategory.id },
    };

    if (id) {
      await ClientCtr.saveProduct({ ...data, id });
    } else {
      await ClientCtr.saveProduct(data);
    }

    setName(data[1] || "");
    setImage(data[2] || "");
    setPrice(data[4] || 0);
    setStock(data[5] || 0);
    setDescription(data[6]);
    setCategory({
      id: data[7] || "",
      name: data[3] || "",
    });
    setErrorNameText("");
    setErrorPriceText("");
    setErrorQuantityText("");
    setErrorCategoryText("");
    setSelectedCategories([
      {
        id: data[7] || "",
        name: data[3] || "",
      },
    ]);
  };

  const handelSubmit = () => {
    setSaving(true);
    handleSaveProduct()
      .then((isError) => {
        setSaving(false);
        return isError;
      })
      .then((isError) => !isError && closeModal(EModal.MODAL_EDIT_PRODUCT))
      .catch((error) => {
         alert(error.message);
         setSaving(false);
       });;
  };

  const handleCloseModal = () => {
    closeModal(EModal.MODAL_EDIT_PRODUCT);
  };

  const CategoryContainer = () => ( 
    <BlockStack gap={"100"}>
      <Text as="p" variant="bodyMd">
        Loại mặt hàng
        <span style={{ color: "rgb(142, 31, 11)" }}> *</span>
      </Text>
      <BlockStack align="space-between" gap={"200"}>
        {
          <BlockStack>
            <Box padding={"050"}>
              <Popover
                active={isActivePopoverCategory}
                preferredAlignment="left"
                preferredPosition="below"
                activator={
                  <Button
                    onClick={() => setIsActivePopoverCategory((prev) => !prev)}
                    disclosure
                  >
                    {category.id
                      ? listCategory.find((c) => c.id === category.id)?.name
                      : "Chọn loại mặt hàng"}
                  </Button>
                }
                onClose={() => setIsActivePopoverCategory((prev) => !prev)}
                ariaHaspopup={false}
              >
                <Box padding={"150"} width="240px">
                  <BlockStack gap={"200"}>
                    <TextField
                      onChange={(v) => {
                        setSearchCategory(v);
                      }}
                      label="Search category"
                      labelHidden
                      placeholder="Tìm kiếm"
                      value={searchCategory}
                      prefix={<Icon source={SearchIcon} tone="base" />}
                      autoComplete="off"
                      clearButton
                      onClearButtonClick={() => {
                        setSearchCategory("");
                      }}
                    />
                    <Scrollable style={{ maxHeight: 300 }}>
                      {listCategory
                        .filter((category) =>
                          category.name
                            .toLowerCase()
                            .includes(searchCategory.toLowerCase())
                        )
                        .map((category) => (
                          <CategoryListItem
                            key={category.id}
                            category={category}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            onlyChoice
                            closePopover={() =>
                              setIsActivePopoverCategory(false)
                            }
                            setCategory={setCategory}
                          />
                        ))}
                    </Scrollable>
                  </BlockStack>
                </Box>
              </Popover>
            </Box>
            {errorCategoryText && (
              <div className="Polaris-Labelled__Error">
                <div id=":r73:Error" className="Polaris-InlineError">
                  <div className="Polaris-InlineError__Icon">
                    <span className="Polaris-Icon">
                      <svg
                        viewBox="0 0 20 20"
                        className="Polaris-Icon__Svg"
                        focusable="false"
                        aria-hidden="true"
                      >
                        <path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"></path>
                        <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                        <path
                          fill-rule="evenodd"
                          d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  Loại mặt hàng không được để trống.
                </div>
              </div>
            )}
          </BlockStack>
        }
      </BlockStack>
    </BlockStack>
  );

  useEffect(() => {
    setSaving(false)
    console.log(0)
  }, [state])

  return (
    <Modal
      open={state[EModal.MODAL_EDIT_PRODUCT]?.active}
      title={data.length ? `Chỉnh sửa mặt hàng ${name}` : "Thêm mặt hàng"}
      onClose={handleCloseModal}
      primaryAction={{
        content: "Lưu",
        onAction: handelSubmit,
        loading: saving,
      }}
      loading={isLoading}
      secondaryActions={[
        {
          content: "Huỷ",
          onAction: handleCloseModal,
        },
      ]}
    >
      <Modal.Section>
        <Form onSubmit={() => {}}>
          <FormLayout>
            <BlockStack gap={"300"}>
              <FormLayout.Group>
                {id && (
                  <TextField
                    value={id.toString()}
                    disabled
                    autoComplete="true"
                    label="Id"
                  />
                )}
                <CategoryContainer />
              </FormLayout.Group>
              <TextField
                label="Tên"
                value={name}
                onChange={(v) => setName(v)}
                autoComplete="true"
                requiredIndicator
                autoFocus
                error={errorNameText}
              />
              {image ? (
                <SelectedMediaCard
                  filename={name}
                  imageUrl={image}
                  setImage={setImage}
                />
              ) : (
                <DropZoneImage setImage={setImage} />
              )}

              <FormLayout.Group>
                <TextField
                  label="Giá niêm yết"
                  value={price.toString()}
                  onChange={(v) => setPrice(+v)}
                  autoComplete="true"
                  type="number"
                  requiredIndicator
                  error={errorPriceText}
                />
                <TextField
                  label="Số lượng"
                  value={stock.toString()}
                  onChange={(v) => setStock(+v)}
                  type="number"
                  requiredIndicator
                  autoComplete="true"
                  error={errorQuantityText}
                />
              </FormLayout.Group>

              <TextField
                label="Mô tả"
                showCharacterCount
                value={description}
                maxLength={200}
                onChange={(v) => setDescription(v)}
                autoComplete="true"
                multiline={true}
              />
            </BlockStack>
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default ProductDetail;
