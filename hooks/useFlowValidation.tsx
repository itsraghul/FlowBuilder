import { FlowValidationContext } from '@/context/FlowValidationContext'
import { useContext } from 'react'

const useFlowValidation = () => {
    const context = useContext(FlowValidationContext);

    if (!context) throw new Error("useFlowValidation must be used within a FlowValidationContext");

    return context;
}

export default useFlowValidation