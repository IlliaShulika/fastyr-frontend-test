import { Button } from "./button";
import { Table } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export const DataTable = ({ data, onSelect, selectedIds }) => {
  const router = useRouter();

  const handleOpenAlbum = (albumId: string) => {
    router.push(`/albums/${albumId}`);
  };

  return (
    <Table className="w-full border border-gray-200 rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 border-b border-gray-200 w-12 text-center"></th>
          <th className="p-3 border-b border-gray-200 text-left text-gray-600 w-1/2">
            Title
          </th>
          <th className="p-3 border-b border-gray-200 text-left text-gray-600 w-1/4">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((album) => (
          <tr key={album.id} className="hover:bg-gray-50">
            <td className="p-3 border-b border-gray-200 text-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={selectedIds.includes(album.id)}
                onChange={(e) => onSelect(album.id, e.target.checked)}
              />
            </td>
            <td className="p-3 border-b border-gray-200 text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[300px]">
              {album.title}
            </td>
            <td className="p-3 border-b border-gray-200">
              <div className="flex space-x-2">
                <Button
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleOpenAlbum(album.id)}
                >
                  Open
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
