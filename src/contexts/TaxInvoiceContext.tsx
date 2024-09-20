import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the type for the data you want to share through context
interface TaxInvoiceData {
  id: string;
  amount: number;
  // Add other relevant fields
}

// Define the context interface
interface TaxInvoiceContextProps {
  invoiceData: TaxInvoiceData | null;
  setInvoiceData: React.Dispatch<React.SetStateAction<TaxInvoiceData | null>>;
}

// Create the context with default values
const TaxInvoiceContext = createContext<TaxInvoiceContextProps | undefined>(undefined);

// Define the provider component's props
interface TaxInvoiceProviderProps {
  children: ReactNode;
}

// Create the provider component
export const TaxInvoiceProvider: React.FC<TaxInvoiceProviderProps> = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState<TaxInvoiceData | null>(null);

  return (
    <TaxInvoiceContext.Provider value={{ invoiceData, setInvoiceData }}>
      {children}
    </TaxInvoiceContext.Provider>
  );
};

// Create a custom hook to use the context
export const useTaxInvoiceContext = () => {
  const context = useContext(TaxInvoiceContext);
  if (context === undefined) {
    throw new Error('useTaxInvoiceContext must be used within a TaxInvoiceProvider');
  }
  return context;
};
