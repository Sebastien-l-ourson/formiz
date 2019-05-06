import { useEffect } from 'react';
import { useFormContext } from '../FormContext';
import {
  fieldRegister, fieldUnregister, fieldSetValue, fieldValidate,
} from '../FormContext/actions';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

export const useField = ({
  name,
  defaultValue,
  validations,
  keepValue,
}) => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const formContext = useFormContext();

  if (!formContext) {
    throw ErrorFieldWithoutForm;
  }

  const { state, dispatch } = formContext;

  useEffect(() => {
    dispatch(fieldRegister(name, defaultValue, validations));

    return () => {
      dispatch(fieldUnregister(name, keepValue));
    };
  }, [name]);

  useEffect(() => {
    // Todo update validations
  }, [validations]);

  useEffect(() => {
    dispatch(fieldValidate(name));
  }, [name, defaultValue, validations]);

  const field = state.fields.find(f => f.name === name);
  const errorMessages = field ? (field.errors || []).filter(x => !!x) : [];

  return {
    value: field ? field.value : null,
    errorMessages,
    errorMessage: errorMessages[0],
    isValid: field ? !field.errors.length : true,
    isInvalid: field ? field.errors.length > 0 : false,
    setValue: (value) => {
      dispatch(fieldSetValue(name, value));
      dispatch(fieldValidate(name));
    },
  };
};
