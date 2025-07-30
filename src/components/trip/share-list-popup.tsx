'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Search, UserPlus, Share2, Copy, Check, Mail, Users, Crown } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { onShareTrip } from '@/app/actions/share-trip'

export type User = {
  id: string
  name: string
  email: string
  avatar_url?: string
  isOnline?: boolean
}

export type SharedUser = User & {
  role: 'owner' | 'editor' | 'viewer'
  addedAt: Date
}

type ShareTripPopupProps = {
  isOpen: boolean
  onClose: () => void
  tripId: string
  tripTitle: string
  currentUser: User
  sharedUsers: SharedUser[]
  onSearchUsers: (query: string) => Promise<User[]>

}

const ShareTripPopup = ({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  currentUser,
  sharedUsers,
  onSearchUsers,

}: ShareTripPopupProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'viewer'>('viewer')
  const searchInputRef = useRef<HTMLInputElement>(null)

  console.log(sharedUsers)

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true)
        try {
          const response = await onSearchUsers(searchQuery)
          const filteredResults = response?.filter(
            user => !sharedUsers.some(shared => shared.id === user.id) && user.id !== currentUser.id
          )
          setSearchResults(filteredResults)
        } catch (error) {
          toast.error('Failed to search users')
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, sharedUsers, currentUser?.id, onSearchUsers])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleShareWithUser = async (user: User) => {
    try {
      await onShareTrip(user.id, selectedRole, tripId)
      setSearchQuery('')
      setSearchResults([])
      toast.success(`Trip shared with ${user.email}`)
    } catch (error) {
      toast.error('Failed to share trip')
    }
  }





  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'editor':
        return <UserPlus className="w-4 h-4 text-blue-500" />
      case 'viewer':
        return <Users className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share Trip</h2>
              <p className="text-sm text-gray-600 truncate max-w-xs">{tripTitle}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="hover:bg-white/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'viewer')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {isSearching && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching users...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2 mb-4">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleShareWithUser(user)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length > 2 && !isSearching && searchResults.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No users found matching "{searchQuery}"</p>
              </div>
            )}
          </div>

         

          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              People with access ({sharedUsers?.length + 1})
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {currentUser?.avatar_url ? (
                      <img
                        src={currentUser?.avatar_url}
                        alt={currentUser?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{currentUser?.name} (You)</p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor('owner')} flex items-center gap-1`}>
                  {getRoleIcon('owner')}
                  Owner
                </div>
              </div>

              {sharedUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user?.avatar_url ? (
                        <img
                          src={user?.avatar_url}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {user?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400">Added {user?.addedAt?.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareTripPopup