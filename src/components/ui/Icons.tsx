import * as Icons from "lucide-react";
import type { ComponentType } from "react";

export const LucideIcon = ({ name, ...props }: { name: keyof typeof Icons; } & React.SVGProps<SVGSVGElement>) => {
    const IconComponent = (Icons[name] || Icons.HelpCircle) as ComponentType<React.SVGProps<SVGSVGElement>>;
    return <IconComponent {...props} />;
};

export default LucideIcon;