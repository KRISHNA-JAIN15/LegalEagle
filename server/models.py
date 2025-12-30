from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ==================== REQUEST MODELS ====================

class CreateChatRequest(BaseModel):
    """Request to create a new chat"""
    user_id: str = Field(..., description="User ID")
    title: Optional[str] = Field("New Chat", description="Chat title")
    prompt_template: Optional[str] = Field("legal_assistant", description="Prompt template to use")


class QueryRequest(BaseModel):
    """Request to ask a question"""
    chat_id: str = Field(..., description="Chat ID to continue conversation")
    query: str = Field(..., description="User's question")
    use_context: Optional[bool] = Field(True, description="Include chat history as context")


class UpdateChatRequest(BaseModel):
    """Request to update chat metadata"""
    title: Optional[str] = None
    prompt_template: Optional[str] = None


class UploadDocumentRequest(BaseModel):
    """Metadata for document upload"""
    chat_id: str = Field(..., description="Chat ID to attach document to")


# ==================== RESPONSE MODELS ====================

class ChatResponse(BaseModel):
    """Single chat response"""
    id: str
    user_id: str
    title: str
    prompt_template: str
    created_at: datetime
    updated_at: datetime
    is_active: bool


class ChatListResponse(BaseModel):
    """List of chats response"""
    chats: List[ChatResponse]
    total: int


class MessageResponse(BaseModel):
    """Single message response"""
    id: str
    chat_id: str
    role: str
    content: str
    sources: List[int]
    created_at: datetime


class ChatHistoryResponse(BaseModel):
    """Chat history with messages"""
    chat: ChatResponse
    messages: List[MessageResponse]


class QueryResponse(BaseModel):
    """Response from RAG query"""
    answer: str
    sources: List[int]
    chat_id: str
    message_id: str
    status: str


class DocumentResponse(BaseModel):
    """Document metadata response"""
    id: str
    chat_id: str
    filename: str
    num_chunks: int
    file_size: int
    uploaded_at: datetime


class UploadResponse(BaseModel):
    """Response after document upload"""
    status: str
    message: str
    document_id: str
    filename: str
    chunks: int


class PromptTemplateResponse(BaseModel):
    """Prompt template information"""
    id: str
    name: str
    description: str
    category: str


class PromptTemplatesListResponse(BaseModel):
    """List of available prompt templates"""
    templates: List[PromptTemplateResponse]


class DeleteResponse(BaseModel):
    """Response for delete operations"""
    status: str
    message: str


class ErrorResponse(BaseModel):
    """Error response"""
    status: str = "error"
    message: str
    detail: Optional[str] = None
