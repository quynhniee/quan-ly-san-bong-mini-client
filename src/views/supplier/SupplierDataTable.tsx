import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Box,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import React from "react";
import { Supplier } from "../../interface";
import CustomEmptyState from "../../components/CustomEmptyState";
import { SkeletonRowTableContent } from "../../components/Skeleton/skeleton-table";
import axios from "axios";
import { SUPPLIER_API } from "../../constants/api";

interface SupplierDataTableProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  pageSize?: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  pagesNumber: number;
  setPagesNumber?: React.Dispatch<React.SetStateAction<number>>;
  fetchSuppliers: () => Promise<void>;
  onViewSupplier: (id: number) => void;
}

function SupplierDataTable(props: SupplierDataTableProps) {
  const { suppliers, setSuppliers, loading, setLoading, pageIndex, setPageIndex, pagesNumber, fetchSuppliers, onViewSupplier} = props;
  const resourceName = {
    singular: "supplier",
    plural: "suppliers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection, removeSelectedResources } =
    useIndexResourceState(suppliers);


  const rowMarkup = suppliers.map(
    ({ id, name, address, email, phoneNumber, createdAt }, index) => (
      <IndexTable.Row
        onClick={() => onViewSupplier(id)}
        id={id.toString()}
        key={id.toString()}
        selected={selectedResources.includes(id.toString())}
        position={index}
      >
        <IndexTable.Cell className="supplier--table--name-column">
          <Text truncate breakWord variant="bodyMd" fontWeight="bold" as="p">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{email}</IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingInlineEnd={"400"}>
            <Text as="span" alignment="end" numeric>
              {phoneNumber}
            </Text>
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>{address}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const onDeleteRows = async () => {
    setLoading(true)

    await Promise.all([
      selectedResources.map(id => +id).forEach(id => {
        axios.delete(`${SUPPLIER_API}/${id}`)
      })
    ])

    await fetchSuppliers()
    removeSelectedResources(selectedResources)
    setLoading(false)
  }

  const bulkActions = [
    {
      icon: DeleteIcon,
      destructive: true,
      content: "Delete customers",
      onAction: onDeleteRows,
    },
  ];

  if (!loading && suppliers.length === 0) return <CustomEmptyState />;

  return (
    <Box paddingBlockEnd="400">
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={suppliers?.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          bulkActions={bulkActions}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Nhà cung cấp" },
            { title: "Email" },
            {
              title: "Số điện thoại",
              alignment: "end",
              paddingBlockEnd: "400",
            },
            { title: "Địa chỉ" },
          ]}
          pagination={{
            hasNext: pageIndex < pagesNumber - 1,
            onNext: () => setPageIndex(pageIndex + 1),
            hasPrevious: pageIndex > 0,
            onPrevious: () => setPageIndex(pageIndex - 1),
          }}
        >
          {loading ? <SkeletonRowTableContent row={10} column={4}/> : rowMarkup}
        </IndexTable>
      </LegacyCard>
    </Box>
  );
}

export default SupplierDataTable;
