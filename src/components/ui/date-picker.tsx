"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ onDateSelect, initialDate }: { onDateSelect: (date: Date) => void; initialDate?: Date }) {
    const [date, setDate] = React.useState<Date | undefined>(initialDate);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        onDateSelect(selectedDate || new Date()); // Cast to Date or provide a default Date
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"themeMode"}
                    className={cn(
                        "w-full justify-start text-left font-normal text-light-1",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-light-1" />
                    {date ? format(date, "PPP") : <span className="text-light-1">Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
