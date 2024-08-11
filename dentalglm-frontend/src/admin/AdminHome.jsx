import React, { useState, useEffect } from 'react';
import Sidebar from './components/app/Sidebar';
import { Bars3Icon, MagnifyingGlassIcon, PencilIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import Loading from './components/app/Loading';
import Alert from './components/Alert';
import AddAdmin from './components/admin/AddAdmin';
import DeleteAdmin from './components/admin/DeleteAdmin';
import UpdateAdmin from './components/admin/UpdateAdmin';

function AdminHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    success: null,
    message: null,
  });

  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const response = await fetch(`/api/user/admins?page=${currentPage}&search=${debouncedSearchQuery}`);
      const data = await response.json();
      if (!data.success) {
        setAlert({
          status: true,
          success: data.success,
          message: data.message,
        });
      }
      setAdmins(data.body.admins);
      setTotalPages(Math.ceil(data.body.total / data.body.limit));
    } catch (error) {
      setAlert({
        status: true,
        success: false,
        message: "Internal server error",
    });
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, debouncedSearchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const openUpdateModal = (admin) => {
    setSelectedAdmin(admin);
    setUpdateModalOpen(true);
  };

  if (loadingAdmins) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="xl:pl-72">
          <div className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-white xl:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form action="#" method="GET" className="flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                  />
                  <input
                    id="search-field"
                    value={searchQuery}
                    onChange={handleSearch}
                    name="search"
                    type="search"
                    placeholder="Search admins "
                    className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 placeholder:text-gray-500 text-white focus:outline-none sm:text-sm"
                  />
                </div>
              </form>
            </div>
          </div>

          <main className="py-5">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center px-5">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-200">Admin Management</h1>
                  <p className="mt-2 text-sm text-gray-400">
                    A list of all the admins on the platform including their name, email and role.
                  </p>
                </div>
                <div className="my-auto flex-none">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(true)}
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
              <div className="mt-5 flow-root bg-gray-900 px-5 rounded-md">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-1 align-middle sm:px-6 lg:px-8">
                    {admins.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300">
                              Admin Details
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
                              Role
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4">
                              <span className="sr-only">Progress</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {admins.map((admin) => (
                            <tr key={admin._id}>
                              <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img alt="" src={admin.profile} className="h-10 w-10 rounded-full" />
                                  </div>
                                  <div className="ml-3 my-auto">
                                    <div className="font-medium text-gray-300">{admin.name}</div>
                                    <div className="mt-1 text-gray-500">{admin.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Admin</td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-2">
                                <button
                                  className="bg-gray-800 p-1.5 rounded-md hover:bg-gray-700"
                                  onClick={() => openUpdateModal(admin)}
                                >
                                  <PencilIcon aria-hidden="true" className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                                </button>
                                <DeleteAdmin admin={admin} fetchAdmins={fetchAdmins} setAlert={setAlert} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-10">
                        <UserGroupIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-400">No admins found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or adding new admins.</p>
                      </div>
                    ) 
                    }
                    <Alert alert={alert} className={'w-full my-3'} />
                    <div className="mt-4 flex justify-center">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-indigo-600 text-gray-200' : 'bg-gray-800 text-gray-400'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <AddAdmin modalOpen={addModalOpen} setModalOpen={setAddModalOpen} setAlert={setAlert} fetchAdmins={fetchAdmins} />
            {selectedAdmin && (
              <UpdateAdmin
                admin={selectedAdmin}
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                setAlert={setAlert}
                fetchAdmins={fetchAdmins}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
