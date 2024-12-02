import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { StoreContext } from "@/context/StoreContext";
import { toast } from "react-toastify";
const AllAthletes = () => {
  const { backendUrl, token, setToken } = useContext(StoreContext);
  const [athletes, setAthletes] = useState([]);
  const [events, setEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch athletes and events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const athletesRes = await axios.get(`${backendUrl}/api/athletes/all`, {
          headers: {
            token: token,
          },
        });
        const eventsRes = await axios.get(`${backendUrl}/api/events`);

        // Map event names by ID
        const eventsMap = {};
        eventsRes.data.events.forEach((event) => {
          eventsMap[event._id] = event.name;
        });

        setAthletes(athletesRes.data.data);
        setEvents(eventsMap);
      } catch (error) {
        console.error(error);
      }
    };
    setToken(localStorage.getItem("token"));
    if (token) {
      fetchData();
    } else {
      toast.error("Error...");
    }
  }, []);

  // Filtered athletes based on search
  const filteredAthletes = athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginated athletes
  const paginatedAthletes = filteredAthletes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6">
      <h1 className="text-4xl font-bold text-[#d7c378] text-center mb-8">
        All Athletes
      </h1>

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto">
        <Input
          placeholder="Search Athletes by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-[#d7c378]  focus:ring-[#d7c378]"
        />
      </div>

      {/* Athletes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAthletes.map((athlete) => (
          <Card
            key={athlete._id}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader className="bg-blue-100 rounded-t-lg p-4">
              <h2 className="text-xl font-semibold text-[#a38e40]">
                {athlete.name}
              </h2>
              <p className="text-sm text-[#d7c378]">{athlete.country}</p>
            </CardHeader>
            <CardContent className="p-4 bg-white text-[12px]">
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {athlete.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Date of Birth:</span>{" "}
                {new Date(athlete.dob).toLocaleDateString()}
              </p>
              <p className="text-gray-700 font-semibold mt-2">Events:</p>
              <ul className="list-disc pl-5 text-gray-600">
                {athlete.participationHistory.map((participation) => (
                  <li key={participation._id}>
                    {events[participation.eventId] || "Unknown Event"}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          totalItems={filteredAthletes.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="flex space-x-2"
        />
      </div>
    </div>
  );
  //   return (
  //     <div className="container mx-auto px-4 py-6">
  //       <h1 className="text-3xl font-semibold mb-4">All Athletes</h1>

  //       {/* Search Input */}
  //       <div className="mb-4">
  //         <Input
  //           placeholder="Search Athletes by Name"
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           className="w-full"
  //         />
  //       </div>

  //       {/* Athletes List */}
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  //         {paginatedAthletes.map((athlete) => (
  //           <Card key={athlete._id}>
  //             <CardHeader>
  //               <h2 className="text-lg font-semibold">{athlete.name}</h2>
  //               <p className="text-sm text-gray-500">{athlete.country}</p>
  //             </CardHeader>
  //             <CardContent>
  //               <p>
  //                 <span className="font-semibold">Email:</span> {athlete.email}
  //               </p>
  //               <p>
  //                 <span className="font-semibold">Date of Birth:</span>{" "}
  //                 {new Date(athlete.dob).toLocaleDateString()}
  //               </p>
  //               <p>
  //                 <span className="font-semibold">Events:</span>
  //               </p>
  //               <ul className="list-disc pl-5">
  //                 {athlete.participationHistory.map((participation) => (
  //                   <li key={participation._id}>
  //                     {events[participation.eventId] || "Unknown Event"}
  //                   </li>
  //                 ))}
  //               </ul>
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>

  //       {/* Pagination */}
  //       <div className="mt-6 flex justify-center">
  //         <Pagination
  //           totalItems={filteredAthletes.length}
  //           itemsPerPage={itemsPerPage}
  //           currentPage={currentPage}
  //           onPageChange={setCurrentPage}
  //         />
  //       </div>
  //     </div>
  //   );
};

export default AllAthletes;
