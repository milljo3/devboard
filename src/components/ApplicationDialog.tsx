"use client";

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Application} from "@/types/applications";
import {EditIcon} from "lucide-react";
import {StatusSelector} from "@/components/StatusSelector";
import {useState} from "react";
import {toast} from "sonner";
import {ApplicationStatus} from "../../node_modules/prisma/prisma-client"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

interface ApplicationDialogProps {
    mode: "add" | "edit";
    application?: Application;
    onEdit?: (updatedFields: Partial<Application>) => void;
    onAdd?: () => void;
}

const formSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    companyUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    position: z.string().min(1, "Job title is required"),
    applicationUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    status: z.nativeEnum(ApplicationStatus),
});

type FormData = z.infer<typeof formSchema>;

export function ApplicationDialog({ mode, application, onEdit, onAdd }: ApplicationDialogProps) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: application?.company || "",
            companyUrl: application?.companyUrl || "",
            position: application?.position || "",
            applicationUrl: application?.applicationUrl || "",
            status: application?.status || ApplicationStatus.APPLIED,
        },
    });

    const handleStatusChange = (status: ApplicationStatus) => {
        setValue("status", status);
    };

    const onSubmit = async (data: FormData) => {
        if (mode === "add") {
            try {
                const response = await fetch("/api/applications", {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {"Content-Type": "application/json"},
                });

                if (!response.ok) {
                    throw new Error("Failed to add application");
                }
            }
            catch (error) {
                console.error("Error creating application", error);
                toast.error("Error creating application");
            }

            if (onAdd) {
                onAdd();
            }
        }
        else {
            if (onEdit) {
                onEdit(getChangedData(data));
            }
        }

        toast.success(mode === "add" ? "Application added!" : "Application updated!");
        reset();
        setOpen(false);
    };

    const getChangedData = (data: FormData): Partial<Application> => {
        return {
            id: application?.id,
            company: application?.company === data.company ? undefined : data.company,
            companyUrl: application?.companyUrl === data.companyUrl ? undefined : data.companyUrl,
            position: application?.position === data.position ? undefined : data.position,
            applicationUrl: application?.applicationUrl === data.applicationUrl ? undefined : data.applicationUrl,
            status: application?.status === data.status ? undefined : data.status,
        };
    }

    const openButton = mode === "add" ? (
        <Button variant="outline">Add Application</Button>
    ) : (
        <Button size="icon" className="w-5 h-5">
            <EditIcon />
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{openButton}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{mode === "add" ? "Add Application" : "Edit Application"}</DialogTitle>
                        <DialogDescription>
                            {mode === "add"
                                ? "Fill out the form to add a new application."
                                : "Make changes to your application here."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" {...register("company")} />
                            {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="company-url">Company Website</Label>
                            <Input id="company-url" {...register("companyUrl")} />
                            {errors.companyUrl && <p className="text-sm text-red-500">{errors.companyUrl.message}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="job-title">Job Title</Label>
                            <Input id="job-title" {...register("position")} />
                            {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="job-url">Application URL</Label>
                            <Input id="job-url" {...register("applicationUrl")} />
                            {errors.applicationUrl && <p className="text-sm text-red-500">{errors.applicationUrl.message}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label>Status</Label>
                            <StatusSelector
                                defaultStatus={application?.status || ApplicationStatus.APPLIED}
                                onSelect={handleStatusChange}
                            />
                            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
