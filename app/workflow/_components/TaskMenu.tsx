"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { TaskType } from '@/types/Tasks/task';
import React from 'react'

const EXTRACTOR_TASKS = [
    TaskType.PAGE_TO_HTML,
    TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    TaskType.EXTRACT_ALL_TEXT_FROM_SIMILAR_SELECTOR
];

const USER_INTERACTOR_TASKS = [
    TaskType.FILL_INPUT,
    TaskType.CLICK_ELEMENT
]

const TIMING_TASKS = [
    TaskType.WAIT_FOR_ELEMENT
]

const RESULTS_DELIVERY = [
    TaskType.DELIVER_VIA_WEBHOOK
]


const TaskMenu = () => {
    return (
        <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion type='multiple' className='w-full' defaultValue={["extraction", "interaction", "timing", "results"]}>
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
        </Button>)
}