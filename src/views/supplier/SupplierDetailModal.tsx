import {
  Box,
  Button,
  Form,
  FormLayout,
  InlineStack,
  Modal,
  TextField,
} from "@shopify/polaris";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SUPPLIER_API } from "../../constants/api";
import { Supplier } from "../../interface";

interface SupplierDetailModalProps {
  active: boolean;
  onDismiss: () => void;
  supplier: Supplier | undefined;
  setSupplier: React.Dispatch<React.SetStateAction<Supplier | undefined>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSuppliers: () => Promise<void>;
}

const SupplierDetailModal = ({
  active,
  onDismiss,
  supplier,
  setSupplier,
  loading,
  fetchSuppliers
}: SupplierDetailModalProps) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<
    string
  >('');
  const [addressError, setAddressError] = useState<string>('');

  const onChangeName = (value: string) => setName(value);
  const onChangeEmail = (value: string) => setEmail(value);
  const onChangePhoneNumber = (value: string) => setPhoneNumber(value);
  const onChangeNotes = (value: string) => setNote(value);
  const onChangeAddress = (value: string) => setAddress(value);

  const onClearName = () => setName('');
  const onClearEmail = () => setEmail('');
  const onClearPhoneNumber = () => setPhoneNumber('');
  const onClearNotes = () => setNote('');
  const onClearAddress = () => setAddress('');

  const resetForm = () => {
    setSupplier(undefined)
    setName('');
    setEmail('');
    setPhoneNumber('');
    setNote('');
    setAddress('');
    setNameError('');
    setEmailError('');
    setPhoneNumberError('');
    setAddressError('');
  };

  const onCancel = () => {
    resetForm();
    onDismiss();
  };

  function validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const checkFormBeforeSubmit = () => {
    let isValid = true

    if (!name || name.trim() === '') {
      isValid = false
      setNameError("Vui lòng điền tên");
    }
    else {
      setNameError('')
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
      isValid = false
      setPhoneNumberError("Vui lòng điền số điện thoại");
    }
    else {
      setPhoneNumberError('')
    }

    if (!address || address.trim() === '') {
      isValid = false
      setAddressError("Vui lòng điền địa chỉ");
    }
    else {
      setAddressError('')
    }

    if (!email || email.trim() === '') {
      isValid = false
      setEmailError("Vui lòng điền email");
    }
    else if (!validateEmail(email)) {
      isValid = false
      setEmailError("Email không đúng định dạng");
    }
    else {
      setEmailError('')
    }

    return isValid;
  }

  const onSubmit = async () => {
    if (!checkFormBeforeSubmit()) {
      return;
    }

    const _supplier = {
      name,
      email,
      phoneNumber,
      address,
      note,
    };

    const response = supplier ? await axios.put(`${SUPPLIER_API}/${supplier.id}`, _supplier) : await axios.post(SUPPLIER_API, _supplier);
    if (response.status === 200) {
      await fetchSuppliers()      
      onDismiss();
      resetForm();
    } else {
      console.log(response);
    }
  };

  useEffect(() => {
    setName(supplier?.name || '');
    setEmail(supplier?.email || '');
    setAddress(supplier?.address || '');
    setPhoneNumber(supplier?.phoneNumber || '');
    setNote(supplier?.note || '');
  }, [supplier])

  return (
    <Modal
      loading={loading}
      instant
      open={active}
      onClose={onCancel}
      title={supplier ? "Thông tin nhà cung cấp" : "Thêm nhà cung cấp"}
      primaryAction={{
        content: supplier ? "Cập nhật" : "Thêm",
        onAction: onSubmit,
        id: 'supplier--modal--submit',
        
      }}
      secondaryActions={[
        {
          content: "Huỷ",
          onAction: onCancel,
          id: 'supplier--modal--cancel',
        },
      ]}
    >
      <Modal.Section>
        <Form onSubmit={onSubmit}>
          <FormLayout>
            <TextField
              clearButton
              onClearButtonClick={onClearName}
              inputMode="text"
              requiredIndicator
              label="Tên nhà cung cấp"
              type="text"
              value={name}
              onChange={onChangeName}
              autoComplete="off"
              error={nameError}
            />
            <TextField
              placeholder="me@example.com"
              clearButton
              onClearButtonClick={onClearEmail}
              inputMode="email"
              requiredIndicator
              label="Email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              autoComplete="off"
              error={emailError}
            />
            <TextField
              clearButton
              onClearButtonClick={onClearPhoneNumber}
              inputMode="tel"
              requiredIndicator
              label="Số điện thoại"
              type="tel"
              value={phoneNumber}
              onChange={onChangePhoneNumber}
              autoComplete="off"
              error={phoneNumberError}
            />
            <TextField
              clearButton
              onClearButtonClick={onClearAddress}
              inputMode="text"
              requiredIndicator
              label="Địa chỉ"
              type="text"
              value={address}
              onChange={onChangeAddress}
              autoComplete="off"
              error={addressError}
            />
            <TextField
              clearButton
              onClearButtonClick={onClearNotes}
              showCharacterCount
              inputMode="text"
              label="Ghi chú"
              type="text"
              value={note}
              onChange={onChangeNotes}
              autoComplete="off"
              maxLength={500}
              multiline={5}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default SupplierDetailModal;
