'use client';
import React, { useEffect, useState } from 'react';
import {
  MapPin, Calendar, Users, Mail, Phone, Send,
  Check, X, Star, Camera, Globe, Heart, MessageCircle, Loader2
} from 'lucide-react';
import supabase from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const CollaborationPage = () => {
  const currentUserRole = 'admin';

  const [requests, setRequests] = useState<Record<string,any>[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [showMessages, setShowMessages] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/collab-requests');
      const { result } = await response.json();
      setRequests(result);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await supabase
        .from('trip_collaborators')
        .update({ accepted_at: new Date() })
        .eq('id', id);
      
      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      // Update the local state immediately for real-time effect
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.collaborator.id === id 
            ? { 
                ...request, 
                collaborator: { 
                  ...request.collaborator, 
                  accepted_at: new Date().toISOString() 
                } 
              }
            : request
        )
      );

      toast.success('Request accepted successfully!');
      
      // Show acceptance message
      setMessages(prev => ({
        ...prev,
        [id]: 'Collaboration request has been accepted! You can now work together on this trip.'
      }));
      setShowMessages(prev => ({ ...prev, [id]: true }));

      // Hide message after 5 seconds
      setTimeout(() => {
        setShowMessages(prev => ({ ...prev, [id]: false }));
      }, 5000);

    } catch (error) {
      toast.error('Failed to accept request');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRemove = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await supabase
        .from('trip_collaborators')
        .delete()
        .eq('id', id);
      
      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      // Update local state immediately
      setRequests(prevRequests => 
        prevRequests.filter(request => request.collaborator.id !== id)
      );

      toast.success('Request removed successfully!');
      
    } catch (error) {
      toast.error('Failed to remove request');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const getStatusColor = (accepted_at: string | null) => {
    return accepted_at
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const filteredRequests = currentUserRole != 'admin'
    ? requests.filter(r => r?.collaborator?.accepted_at === null)
    : requests;

  return (
    <div className="min-h-[50vh] max-w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="relative w-full bg-gradient-to-r to-travel-primary text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Heart className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Join with active members
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Connect with fellow adventurers, local guides, photographers, and content creators.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              {requests.filter(r => r.collaborator?.accepted_at === null).length} Pending
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {requests.filter(r => r.collaborator?.accepted_at != null).length} Active
            </span>
          </div>
        </div>

        <div className="grid gap-6 mt-6">
          {filteredRequests.map((request, i) => {
            const { trip, collaborator } = request;
            const isLoading = loadingStates[collaborator.id];
            const showMessage = showMessages[collaborator.id];
            const message = messages[collaborator.id];

            return (
              <div key={collaborator.id || i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                {/* Success Message */}
                {showMessage && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">{message}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {trip?.title?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{trip?.title}</h3>
                      <p className="text-blue-600 font-semibold capitalize">{collaborator?.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border transition-all duration-300 ${getStatusColor(collaborator?.accepted_at)}`}>
                      {collaborator?.accepted_at ? "Accepted" : "Pending"}
                    </span>
                    {currentUserRole && (
                      <div className="flex gap-2">
                        {!collaborator?.accepted_at && (
                          <Button
                            onClick={() => handleAccept(collaborator.id)}
                            disabled={isLoading}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[36px]"
                            title="Accept collaboration"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRemove(collaborator.id)}
                          disabled={isLoading}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[36px]"
                          title="Remove request"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{trip?.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{trip?.start_date} to {trip?.end_date}</span>
                    </div>
                    {trip?.cover_image_url && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Camera className="w-4 h-4" />
                        <Image
                        width={100}
                        height={100}
                        alt="Cover Image"
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/travelplanner/${trip.cover_image_url}`}
                          className="text-blue-600 hover:underline"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Collaboration invited on: {new Date(collaborator?.invited_at).toLocaleDateString()}
                    </p>
                    {collaborator?.accepted_at && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Accepted on: {new Date(collaborator.accepted_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Trip Description</h4>
                    <p className="text-gray-600">{trip?.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Users className="w-10 h-10 mx-auto mb-4" />
            No collaboration requests to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPage;