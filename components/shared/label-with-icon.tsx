import { LucideIcon } from "lucide-react";
import { FormLabel } from "../ui/form";

export function LabelWithIcon({
    icon: Icon,
    children,
}: {
    icon: LucideIcon;
    children: React.ReactNode;
}) {
    return (
        <FormLabel className='font-semibold text-base mb-2 flex items-center gap-2 text-primary'>
            <Icon className='w-5 h-5 text-primary flex-shrink-0' />
            {children}
        </FormLabel>
    );
}