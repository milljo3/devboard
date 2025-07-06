const ApplicationsTitles = () => {
    return (
        <div className="
          grid
          w-full
          px-4
          py-2
          text-sm
          font-medium
          border-b
          text-muted-foreground
          grid-cols-[3fr_3fr_2fr]
          md:grid-cols-[2fr_2fr_1fr_1fr_1fr]
          justify-center
        ">
            <span>Company</span>
            <span>Position</span>
            <span className="md:hidden">Status</span>
            <span className="hidden md:block">Created</span>
            <span className="hidden md:block">Updated</span>
            <span className="hidden md:block">Status</span>
        </div>
    );
};

export default ApplicationsTitles;