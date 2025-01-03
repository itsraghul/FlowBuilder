"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { TaskType } from '@/types/Tasks/task';
import { CoinsIcon } from 'lucide-react';
import React from 'react'

const EXTRACTOR_TASKS = [
    TaskType.PAGE_TO_HTML,
    TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    TaskType.EXTRACT_ALL_TEXT_FROM_SIMILAR_SELECTOR,
    TaskType.EXTRACT_DATA_WITH_AI
];

const USER_INTERACTOR_TASKS = [
    TaskType.FILL_INPUT,
    TaskType.CLICK_ELEMENT,
    TaskType.NAVIGATE_URL,
    TaskType.SCROLL_TO_ELEMENT
]

const TIMING_TASKS = [
    TaskType.WAIT_FOR_ELEMENT
]

const RESULTS_DELIVERY = [
    TaskType.DELIVER_VIA_WEBHOOK
]

const DATA_STORAGE = [
    TaskType.READ_PROPERTY_FROM_JSON,
    TaskType.ADD_PROPERTY_TO_JSON
]


const TaskMenu = () => {
    return (
        <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion type='multiple' className='w-full' defaultValue={["extraction", "interaction", "timing", "results", "storage"]}>
                <AccordionItem value='interaction'>
                    <AccordionTrigger className='font-bold'>
                        User Interactions
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        {
                            USER_INTERACTOR_TASKS.map((task, index) => <TaskMenuBtm key={index} taskType={task} />)
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='extraction'>
                    <AccordionTrigger className='font-bold'>
                        Data Extractors
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        {
                            EXTRACTOR_TASKS.map((task, index) => <TaskMenuBtm key={index} taskType={task} />)
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='timing'>
                    <AccordionTrigger className='font-bold'>
                        Timing Controls
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        {
                            TIMING_TASKS.map((task, index) => <TaskMenuBtm key={index} taskType={task} />)
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='results'>
                    <AccordionTrigger className='font-bold'>
                        Result Delivery
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        {
                            RESULTS_DELIVERY.map((task, index) => <TaskMenuBtm key={index} taskType={task} />)
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='storage'>
                    <AccordionTrigger className='font-bold'>
                        Data Storage
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        {
                            DATA_STORAGE.map((task, index) => <TaskMenuBtm key={index} taskType={task} />)
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    )
}

export default TaskMenu;


const TaskMenuBtm = ({ taskType }: { taskType: TaskType }) => {
    const task = TaskRegistry[taskType];

    const onDragStart = (event: React.DragEvent, type: TaskType) => {
        event.dataTransfer.setData("application/reactflow", type);
        event.dataTransfer.effectAllowed = "move";
    }

    return (
        <Button variant={"secondary"}
            className='flex justify-between items-center gap-2 border w-full'
            draggable
            onDragStart={event => onDragStart(event, taskType)}
        >
            <div className="flex gap-2">
                <task.icon size={20} />
                {task.label}
            </div>
            <Badge className='gap-2 flex items-center' variant={'outline'}>
                <CoinsIcon size={16} />
                {task.credits}
            </Badge>
        </Button>)
}