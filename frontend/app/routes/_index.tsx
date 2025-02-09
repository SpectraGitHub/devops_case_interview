import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { httpGet, httpPatch, httpPost } from "~/utils/fetcher";

export const meta: MetaFunction = () => {
  return [{ title: "Oppgaveliste" }];
};

// task structure
interface Task {
  url: string;
  id: number;
  title: string;
  completed: boolean;
  due_date?: string;
}

interface DateErrorHandling {
  error?: string;
}

// function to check if date is after today
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // set to midnight
  return !isNaN(date.getTime()) && date >= today;
}

// action function to add task
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const due_date = formData.get("due_date") as string;

  // checks if date is in the past
  if (due_date && !isValidDate(due_date)) {
    return Response.json({ error: "Date is in the past" }, { status: 400 });
  }

  try {
    // post request to add task
    await httpPost<Task>(
      "http://localhost:8000/api/todo/tasks/",
      JSON.stringify({ title, due_date: due_date || undefined })
    );
    return redirect("/");
  } catch (error) {
    // handles server error
    return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
};

// loader function to fetch tasks
export const loader = async () => {
  const taskData = await httpGet<Task[]>(
    "http://localhost:8000/api/todo/tasks/"
  );

  return { taskData };
};

export default function Index() {

  // fetches task data from loader
  const { taskData } = useLoaderData<typeof loader>();
  
  // fetches error from action
  const actionData = useActionData<DateErrorHandling>();

  // used to store tasks
  const [tasks, setTasks] = useState(taskData);

  // used to display error message
  const [error, setError] = useState(actionData?.error || null);

  // sets task as completed
  const setCompleted = async (task: Task, completed: boolean) => {
    try {
      // patch request to update task
      await httpPatch<Task>(
        `http://localhost:8000/api/todo/tasks/${task.id}/`,
        JSON.stringify({ completed })
      );
      // updates task list
      task.completed = completed;
      setTasks([...tasks]);
    } catch (error) {
      // handles error
      console.error("Failed to update task:", error);
    }
  };

  // deletes completed tasks
  const deleteCompletedTasks = async () => {
    try {
      // post request to delete completed tasks because delete method is not provided
      await httpPost("http://localhost:8000/api/todo/tasks/delete_completed/");
      const updatedTasks = tasks.filter((task) => !task.completed);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-xl flex-grow mt-14">
        <fieldset className="border-2 border-gradient-to-r from-indigo-600 to-indigo-400 p-8 rounded-xl">
          <div className="text-base font-semibold text-gray-900 mb-4 mt-4 px-2">
            Oppgaver
          </div>
          <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
            {tasks.length === 0 && (
              <div className="py-4 text-gray-500 italic">Ingen oppgaver</div>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="relative flex gap-3 py-4">
                <div className="min-w-0 flex-1 text-sm/6">
                  <label
                    htmlFor={`person-${task.id}`}
                    className={clsx("select-none font-medium", {
                      "text-gray-500 italic": task.completed,
                      "text-gray-900": !task.completed,
                    })}
                  >
                    {task.title}
                  </label>

                  <div className={clsx("text-sm", {
                    "text-red-500": task.due_date,
                    "text-gray-500": !task.due_date
                  })}>
                    {task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : "No due date"}
                  </div>
                </div>
                <div className="flex h-6 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      defaultChecked={task.completed}
                      id={`person-${task.id}`}
                      name={`person-${task.id}`}
                      type="checkbox"
                      className="col-start-1 row-start-1 appearance-none rounded-lg border-2 border-indigo-600 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:border-gray-300 disabled:bg-gray-100"
                      onChange={(e) => setCompleted(task, e.target.checked)}
                    />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-[:checked]:opacity-100"
                      />
                      <path
                        d="M3 7H11"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-[:indeterminate]:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            <form method="post" action="?index">
              <div className="relative flex gap-3 py-4">
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Legg til..."
                  aria-label="Tittel"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-2 border-gradient-to-r from-indigo-600 to-indigo-400"
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                  required
                />
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${error ? 'border-red-500' : 'border-2 border-indigo-600'}`}
                />
                <button
                  type="submit"  // set this to submit so that it was possible to add tasks
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </form>

            <button
            type="button"
            className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={deleteCompletedTasks}
          >
            Delete Completed Tasks
          </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
