import React, { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';


interface Props {
    children: ReactNode;
    content: ReactNode;
    side?: "top" | "left" | "right" | "bottom";
}
const TooltipWrapper = (props: Props) => {
    if (!props.content) return props.children;
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                <TooltipContent side={props.side}>{props.content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}

export default TooltipWrapper;