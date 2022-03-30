import { shallowEqual } from "react-redux";
export const checkEquality = (left: any, right: any) => {
  let areEqual = true;
  Object.keys(left).forEach((key) => {
    if (!shallowEqual(left[key], right[key])) {
      areEqual = false;
    }
  });
  return areEqual;
};
