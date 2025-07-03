import GetStartedButton from "@/components/GetStartedButton";

export default function Home() {
  return (
      <div className="flex items-center justify-center h-dvh bg-primary">
        <div className="flex items-center justify-center">
            <div className="flex justify-center gap-6 flex-col items-center text-primary-foreground">
                <h1 className="text-6xl font-bold">Welcome to DevBoard</h1>
                <p>Start tracking your jobs now!</p>
            </div>
            <GetStartedButton />
        </div>
      </div>
  )
}
