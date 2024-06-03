import {
    Form,
    FormLayout,
    Modal,
    TextField,
  } from "@shopify/polaris";
  import React, { useEffect, useState } from "react";
  import { Supplier } from "../../interface";
import ClientCtr from '../../ClientCtr';
  
  interface EditSupplierDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    supplier: Supplier;
    fetchData: () => Promise<void>;
    setSelectedRows: Function;
  }
  
  const EditSupplierDialog = ({
    open,
    setOpen,
    supplier,
    fetchData,
    setSelectedRows,
  }: EditSupplierDialogProps) => {
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
    const [taxCode, setTaxCode] = useState<string>('');
    const [taxCodeError, setTaxCodeError] = useState<string>('');
  
    const onChangeName = (value: string) => setName(value);
    const onChangeEmail = (value: string) => setEmail(value);
    const onChangePhoneNumber = (value: string) => setPhoneNumber(value);
    const onChangeNotes = (value: string) => setNote(value);
    const onChangeAddress = (value: string) => setAddress(value);
    const onChangeTaxCode = (value: string) => setTaxCode(value);
  
    const onClearName = () => setName('');
    const onClearEmail = () => setEmail('');
    const onClearPhoneNumber = () => setPhoneNumber('');
    const onClearNotes = () => setNote('');
    const onClearAddress = () => setAddress('');
    const onClearTaxCode = () => setTaxCode('');
  
    // const resetForm = () => {
    //   setSupplier(undefined)
    //   setName('');
    //   setEmail('');
    //   setPhoneNumber('');
    //   setNote('');
    //   setAddress('');
    //   setNameError('');
    //   setEmailError('');
    //   setPhoneNumberError('');
    //   setAddressError('');
    // };
  

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

      if (!taxCode || taxCode.trim() === '') {
        isValid = false
        setTaxCodeError("Vui lòng điền mã số thuế");
      }
      else {
        setTaxCodeError('')
      }
  
      return isValid;
    }
  
    const onSubmit = async () => {
      if (!checkFormBeforeSubmit()) {
        return;
      }

      try {
        const _supplier = {
          id: supplier?.id,
          name,
          email,
          phoneNumber,
          address,
          note,
          taxCode
        };

        console.log(_supplier)

        await ClientCtr.saveSupplier(_supplier)
    
        await fetchData();
        setOpen(false);
        setSelectedRows([]);
      } catch (error: any) {

        alert(error.response.data);
      }

    };
  
    useEffect(() => {
      setName(supplier?.name || '');
      setEmail(supplier?.email || '');
      setAddress(supplier?.address || '');
      setPhoneNumber(supplier?.phoneNumber || '');
      setNote(supplier?.note || '');
      setTaxCode(supplier?.taxCode || '');
    }, [supplier])
  
    return (
      <Modal
        instant
        open={open}
        onClose={() => setOpen(false)}
        title={supplier ? "Thông tin nhà cung cấp" : "Thêm nhà cung cấp"}
        primaryAction={{
          content: supplier ? "Cập nhật" : "Thêm",
          onAction: onSubmit,
          id: 'supplier--modal--submit',
          
        }}
        secondaryActions={[
          {
            content: "Huỷ",
            onAction: () => setOpen(false),
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
              <FormLayout.Group> 
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
                onClearButtonClick={onClearTaxCode}
                inputMode="email"
                requiredIndicator
                label="Mã số thuế"
                type="text"
                value={taxCode}
                onChange={onChangeTaxCode}
                autoComplete="off"
                error={taxCodeError}
              />
                </FormLayout.Group> 

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
  
  export default EditSupplierDialog;
  