import React, { createContext, useContext, ReactNode, useCallback } from 'react';

interface RadioGroupContextType {
  value: string;
  updateValue: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProviderProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}

export const RadioGroupProvider: React.FC<RadioGroupProviderProps> = ({ value, disabled = false, onChange, children }) => {
  const updateValue = useCallback((newValue: string) => {
    if (!disabled) {
      onChange(newValue);
    }
  }, [disabled, onChange]);

  return (
    <RadioGroupContext.Provider value={{ value, updateValue, disabled }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('useRadioGroupContext must be used within a RadioGroupProvider');
  }
  return context;
};
