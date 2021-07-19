import { Button, Stepper } from '../../../components/common';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import Options from './Options';
import Thumbnail from './Thumbnail';
import ServiceImage from './ServiceImage';
import Detail from './Detail';
import { useDispatch } from 'react-redux';
import * as API from '../../../src/reducers/store/mypage';

const weekValue = {
  content: [
    { value: '월요일', label: '월요일' },
    { value: '화요일', label: '화요일' },
    { value: '수요일', label: '수요일' },
    { value: '목요일', label: '목요일' },
    { value: '금요일', label: '금요일' },
    { value: '토요일', label: '토요일' },
    { value: '일요일', label: '일요일' },
  ],
  totalCount: 7,
};

const monthValue = {
  content: Array(1 * 31)
    .fill({})
    .map((arr, index) => {
      return {
        value: `${index + 1}`,
        label: `${index + 1} 일`,
      };
    }),

  totalCount: 31,
};

const categorySample = {
  content: [
    {
      value: '1',
      label: '식품',
    },
    {
      value: '2',
      label: '생활',
    },
    {
      value: '3',
      label: '패션의류',
    },
    {
      value: '4',
      label: '뷰티',
    },
    {
      value: '5',
      label: '스포츠/레저',
    },
    {
      value: '6',
      label: '패션잡화',
    },
  ],
  totalCount: 6,
};

const subCategorySample = {
  content: [
    { value: '1', label: '쌀/과일/농축수산물' },
    { value: '2', label: '가공식품' },
    { value: '3', label: '과자/빵/떡' },
    { value: '4', label: '음료/생수/커피' },
    { value: '5', label: '홍삼/건강/다이어트식품' },
    { value: '6', label: '생활/제지/잡화' },
    { value: '7', label: '욕실/청소' },
    { value: '8', label: '주방' },
    { value: '9', label: '건강관리' },
    { value: '10', label: '반려동물/애완용품' },
    { value: '11', label: '악기/취미/만들기' },
    { value: '12', label: '문구/사무/용지' },
    { value: '13', label: '도서/음반/DVD' },
    { value: '14', label: '여성의류' },
    { value: '15', label: '남성의류' },
    { value: '16', label: '언더웨어' },
    { value: '17', label: '스킨케어/메이크업' },
    { value: '18', label: '향수/바디/헤어' },
    { value: '19', label: '신발/수제화' },
    { value: '20', label: '가방/지갑/잡화' },
    { value: '21', label: '쥬얼리/악세서리' },
    { value: '22', label: '테마의류' },
  ],
  totalCount: 22,
};

function getStpes() {
  return [
    '상품 TItle 입력',
    '옵션 등록',
    '썸네일 등록',
    '서비스 이미지 등록',
    '상세 정보 등록',
  ];
}

function Product() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categorySample.content[0].value);
  const [subCategory, setSubCategory] = useState(
    subCategorySample.content[0].value,
  );
  const [cycle, setCycle] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [options, setOptions] = useState([]);
  const [maxCount, maxConut] = useState(0);
  const [thumbNails, setTuhmbNails] = useState<string[]>([]);
  const [services, setServices] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState('');
  const [etc, setEtc] = useState('');

  const getStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return (
            <Title
              title={title}
              setTitle={setTitle}
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubcategory={setSubCategory}
              categories={categorySample}
              subCategories={subCategorySample}
            />
          );
        case 1:
          return (
            <Options
              cycle={cycle}
              setCycle={setCycle}
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              options={options}
              setOptions={setOptions}
              maxCount={maxCount}
              maxConut={maxConut}
              weekValue={weekValue}
              monthValue={monthValue}
            />
          );
        case 2:
          return (
            <Thumbnail thumbNails={thumbNails} setTuhmbNails={setTuhmbNails} />
          );

        case 3:
          return <ServiceImage services={services} setServices={setServices} />;
        case 4:
          return (
            <Detail
              deliveryOption={deliveryOption}
              setDeliveryOption={setDeliveryOption}
              etc={etc}
              setEtc={setEtc}
            />
          );
        default:
          return;
      }
    },
    [
      title,
      setTitle,
      category,
      setCategory,
      subCategory,
      setSubCategory,
      cycle,
      setCycle,
      deliveryDate,
      setDeliveryDate,
      options,
      setOptions,
      maxCount,
      maxConut,
      thumbNails,
      setTuhmbNails,
      services,
      setServices,
      deliveryOption,
      setDeliveryOption,
      etc,
      setEtc,
    ],
  );

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const dispatch = useDispatch();

  const handleFinish = () => {
    const serviceOptions = options.map((option) => {
      return option;
    });

    const serviceImages = thumbNails.map((thumbNail, index) => {
      return thumbNail;
    });

    dispatch(
      API.saveProduct({
        serviceName: title,
        category: category,
        subCategory: subCategory,
        serviceCycle: cycle,
        availableDay: deliveryDate,
        maxCount: String(maxCount),
        serviceOptions: serviceOptions,
        serviceImages: serviceImages,
        // serviceImages: service,
        deliveryOption: deliveryOption,
        etc: etc,
      }),
    );
  };

  return (
    <ProductContainer>
      <Stepper
        steps={getStpes()}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        content={getStepContent(activeStep)}
        handleNextButton={handleNext}
        handleBackButton={handleBack}
        handleFinushButton={handleFinish}
      />
    </ProductContainer>
  );
}

export default Product;

const ProductContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #cfcfcf;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const ProductContentContainer = styled.div`
  width: 100vw;
  height: 500px;
  padding: 10px;
`;

const UpperContainer = styled.div`
  background-color: #fff;
  width: 1300px;
  height: 500px;
  margin: 10px;
  display: flex;
`;

const SideContainer = styled.div`
  background-color: #fff;
  width: 50%;
  height: 100%;
  padding: 10px;
`;
