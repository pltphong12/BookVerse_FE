import { decrement, increment } from "../../redux/slide/counter.slice"
import { useAppDispatch, useAppSelector } from "../../redux/hook"
import { callUploadSingleFile } from "../../services/api"
import { useState } from "react"

export const HomePage = () => {
    const count = useAppSelector((state) => state.counter)
    const countAction = useAppDispatch()
    const [file, setFile] = useState<any | null>(null)

    const handleUploadFileLogo = async () => {
        if (file) {
            const res = await callUploadSingleFile(file, "avatar");
            console.log(file?.name)
            if (res) {
                console.log("File uploaded successfully:", res);
                setFile(null);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            
        }
    };

    return (
        <>
            <div>Home Page {count.value}</div>
            <div className="flex justify-start gap-2">
                <button className="btn btn-neutral" onClick={() => {
                    countAction(increment())
                }}>Increase</button>
                <button className="btn btn-neutral" onClick={() => {
                    countAction(decrement())
                }}>Decrease</button>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-bold">Test API Upload File</h2>
                <div className="flex items-center gap-2 mt-2">
                    <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs" />
                    <button className="btn btn-primary" onClick={handleUploadFileLogo} disabled={!file}>Upload</button>
                </div>
            </div>
        </>
    )
}