"use client"
import { useState } from 'react'
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from 'src/app/users/hooks/useCurrentUser'
import createComment from '../mutations/createComment'
import getComments from '../queries/getComments'
import { formatDate } from 'src/app/utils/formatDate'
import { Comment as PrismaComment } from "@prisma/client"

interface CommentWithUser extends PrismaComment {
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface CommentsProps {
  taskId: string
}

export function Comments({ taskId }: CommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const currentUser = useCurrentUser()
  const [createCommentMutation] = useMutation(createComment)
  const [{ comments }, { refetch, isLoading }] = useQuery(getComments, { taskId })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      await createCommentMutation({
        taskId,
        content: newComment.trim()
      })
      setNewComment('')
      refetch()
    } catch (error: any) {
      console.error('Failed to create comment:', error)
      setError(error.message || 'Failed to create comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse p-4 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-3">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  }

  return (
    <div >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-2 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comments ({comments?.length || 0})</h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto px-2">
            {comments?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No comments yet</p>
              </div>
            ) : (
              comments?.map((comment: CommentWithUser) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(comment.user.name || comment.user.email)[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.user.name || comment.user.email}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {currentUser ? (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="border rounded-lg focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <label htmlFor="comment" className="sr-only">Add your comment</label>
                <textarea
                  id="comment"
                  rows={3}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Posting...
                    </>
                  ) : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">
                Please log in to add comments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
