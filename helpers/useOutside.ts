import {useEffect, useRef, useState} from "react";

export default function useOutside(initialIsVisible: boolean) {
    const ref = useRef<any>(null)
    const [isShow, setIsShow] = useState<any>(initialIsVisible)

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsShow(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    })
    return {ref, isShow, setIsShow}
}


export function removeEmptyValues(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj
        .map(removeEmptyValues)
        .filter(item => !(item === null || item === undefined || (typeof item === 'object' && Object.keys(item).length === 0)));
    }
  
    const result: any = {};
  
    Object.keys(obj).forEach(key => {
      const value = removeEmptyValues(obj[key]);
  
      if (
        value !== null &&
        value !== undefined &&
        (typeof value !== 'string' || value.trim() !== '') &&
        (!Array.isArray(value) || value.length > 0) &&
        (typeof value !== 'object' || Object.keys(value).length > 0)
      ) {
        result[key] = value;
      }
    });
  
    return result;
  }