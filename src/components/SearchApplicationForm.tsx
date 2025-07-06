import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

interface SearchApplicationFormProps {
    onSearch: (search: string) => void;
    isPending: boolean;
}

const SearchApplicationForm = ({onSearch, isPending}: SearchApplicationFormProps) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const searchValue: string = String(formData.get("search"));
        onSearch(searchValue.trim().toLowerCase());
    }

    return (
        <form onSubmit={handleSubmit} className="md:flex bg-white rounded-md borde gap-2 hidden">
            <div>
                <Label htmlFor="search"></Label>
                <Input
                    placeholder="Search by company..."
                    type="text"
                    name="search"
                    id="search"
                    className="!border-r-0"
                />
            </div>
            <Button
                type="submit"
                variant="secondary"
                disabled={isPending}
                className="px-3 py-2 bg-white cursor-pointer"
            >
                🔎
            </Button>
        </form>
    );
};

export default SearchApplicationForm;