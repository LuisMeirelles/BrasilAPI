import { cpfIsValid } from '@/lib/cpfValidator';
import { cnpjIsValid } from '@/lib/cnpjValidator';

const emvSpecification = {
  payloadFormat: {
    id: '00',
    value: '01',
  },
  merchantAccountInformationPix: {
    id: '26',
    required: true,
    fields: {
      gui: {
        id: '00',
        value: 'BR.GOV.BCB.PIX',
      },
      pixKey: {
        id: '01',
        description:
          'Chave Pix (CPF, CNPJ, e-mail, telefone ou chave aleatória) [pixKey]',
        required: true,
        validate: (pixKey) => {
          const regexUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

          const regexEmail =
            /^(?=.{1,77}$)[a-z0-9.!#$&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;

          const regexPhone = /(^55[1-9]{2}\d{8}$)|(^55[1-9]{2}9\d{8}$)/;
          const regexCpf = /^\d{11}$/;
          const regexCnpj = /^\d{14}$/;

          const numberOnlyPixKey = pixKey.replace(/\D/g, '');

          return (
            regexUuid.test(pixKey) ||
            regexEmail.test(pixKey) ||
            regexPhone.test(numberOnlyPixKey) ||
            (regexCpf.test(numberOnlyPixKey) && cpfIsValid(numberOnlyPixKey)) ||
            (regexCnpj.test(numberOnlyPixKey) && cnpjIsValid(numberOnlyPixKey))
          );
        },
      },
      additionalInfo: {
        id: '02',
        description: 'Informações adicionais opcionais [additionalInfo]',
        minLength: 1,
        maxLength: 99,
      },
    },
  },
  merchantCategoryCode: {
    id: '52',
    value: '0000',
  },
  transactionCurrency: {
    id: '53',
    value: '986',
  },
  transactionAmount: {
    id: '54',
    description: 'Valor da transação [transactionAmount]',
    minLength: 1,
    maxLength: 13,
  },
  countryCode: {
    id: '58',
    value: 'BR',
  },
  merchantName: {
    id: '59',
    description: 'Nome do recebedor [merchantName]',
    required: true,
    minLength: 1,
    maxLength: 25,
  },
  merchantCity: {
    id: '60',
    description: 'Cidade do recebedor [merchantCity]',
    required: true,
    minLength: 1,
    maxLength: 15,
  },
  postalCode: {
    id: '61',
    description: 'Código postal do recebedor [postalCode]',
    required: true,
    length: 8,
  },
  additionalDataFieldTemplate: {
    id: '62',
    required: true,
    minLength: 5,
    maxLength: 29,
    fields: {
      referenceLabel: {
        id: '05',
        description: 'ID da transação [transactionId]',
        required: true,
        minLength: 1,
        maxLength: 25,
      },
    },
  },
  crc: {
    id: '63',
    description: 'Código de verificação CRC (calculado)',
    required: true,
    length: 4,
  },
};

export default emvSpecification;
