from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):

     def get(self, request):
        try:
            # Retrieve all todo items from the 'todos' collection
            todos = list(db.todos.find())
            # Convert MongoDB documents to JSON-serializable format
            for todo in todos:
                todo['_id'] = str(todo['_id'])
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
     def post(self, request):
        try:
            # Get the todo item from the request body
            todo_item = request.data
            # Insert the new todo item into the 'todos' collection
            result = db.todos.insert_one(todo_item)
            # Return the ID of the inserted document
            return Response({'inserted_id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

