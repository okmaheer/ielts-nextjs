"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Pagination from "./Pagination";
import UserFormModal from "./UserFormModal";
import { useModal } from "@/hooks/useModal";
import { userService, type User, type UserFilters } from "../../../lib/services/userService";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [perPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const { isOpen, openModal, closeModal } = useModal();

  // Fetch users
  const fetchUsers = async (filters?: UserFilters) => {
    try {
      setLoading(true);
      const response = await userService.getUsers(filters);

      setUsers(response.data);
      setCurrentPage(response.current_page);
      setTotalPages(response.last_page);
      setTotalUsers(response.total);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to Fetch Users";
      console.error("Failed to Fetch Users:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers({ page: 1, per_page: perPage });
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchUsers({
      page,
      per_page: perPage,
      search: search || undefined,
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers({
      page: 1,
      per_page: perPage,
      search: search || undefined,
    });
  };

  // Open create modal
  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    openModal();
  };

  // Open edit modal
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    openModal();
  };

  // Handle delete
  const handleDelete = async (id: string | number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      // Refresh the list
      fetchUsers({
        page: currentPage,
        per_page: perPage,
        search: search || undefined,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete user";
      console.error("Failed to delte user:", error);
      toast.error(errorMessage);
    }
  };

  // Handle modal success (refresh list)
  const handleModalSuccess = () => {
    fetchUsers({
      page: currentPage,
      per_page: perPage,
      search: search || undefined,
    });
  };

  return (
    <div>
      {/* Header with search and create button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {totalUsers} User(s) Found
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pr-12"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Search size={16} />
            </Button>
          </form>

          {/* Create Button */}
          <Button
            size="md"
            className="flex items-center gap-2"
            onClick={handleCreate}
          >
            <Plus size={18} />
            Create
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Country
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id.toString()}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.country}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={
                          user.status === 1 || user.status === "1"
                            ? "success"
                            : "warning"
                        }
                      >
                        {user.status === 1 || user.status === "1"
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="!w-8 !h-8 !p-0 !min-w-0 hover:bg-brand-500 hover:text-white hover:border-brand-500"
                        >
                          <Pencil size={16} />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(Number(user.id), user.name)}
                          className="!w-8 !h-8 !p-0 !min-w-0 hover:bg-red-500 hover:text-white hover:border-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
}