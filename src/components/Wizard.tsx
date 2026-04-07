import React from 'react';
import { AppState, Task } from '../types';
import { CATEGORIES } from '../data/categories';
import { v4 as uuidv4 } from 'uuid';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowRight, ArrowLeft, Plus, Trash2, Download } from 'lucide-react';

export default function Wizard({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const handleNext = () => setState(s => ({ ...s, currentStep: Math.min(4, s.currentStep + 1) }));
  const handlePrev = () => setState(s => ({ ...s, currentStep: Math.max(0, s.currentStep - 1) }));

  const updateProfile = (field: string, value: string | number) => {
    setState(s => ({ ...s, profile: { ...s.profile, [field]: value } }));
  };

  const addTask = () => {
    const defaultCat = CATEGORIES[0];
    const newTask: Task = {
      id: uuidv4(),
      name: 'New Task',
      category: defaultCat.name,
      hoursPerWeek: 5,
      importance: 5,
      automationPotential: defaultCat.defaultPotential,
      suggestedTools: defaultCat.tools
    };
    setState(s => ({ ...s, tasks: [...s.tasks, newTask] }));
  };

  const updateTask = (id: string, field: string, value: string | number) => {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => {
        if (t.id === id) {
          const updated = { ...t, [field]: value };
          // Auto-update default potential and tools if category changes
          if (field === 'category') {
            const cat = CATEGORIES.find(c => c.name === value);
            if (cat) {
              updated.automationPotential = cat.defaultPotential;
              updated.suggestedTools = cat.tools;
            }
          }
          return updated;
        }
        return t;
      })
    }));
  };

  const removeTask = (id: string) => {
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));
  };

  const renderStep0 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-purple-600">
          The "AI Time Audit & ROI" Strategy
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Helping business professionals identify profound time savings through a human-centered AI strategy.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
            <span className="font-bold text-xl">1</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Inventory Tasks</h3>
          <p className="text-gray-600 text-sm">We walk through your typical week, mapping out routine tasks, their time cost, and business value.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center text-purple-700 mb-4">
            <span className="font-bold text-xl">2</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Identify Opportunities</h3>
          <p className="text-gray-600 text-sm">We assess the practical automation potential of each task using the latest AI tools and agents.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-300">
          <div className="h-12 w-12 bg-purple-300 rounded-lg flex items-center justify-center text-purple-800 mb-4">
            <span className="font-bold text-xl">3</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Project ROI</h3>
          <p className="text-gray-600 text-sm">We calculate temporal and financial savings across weekly, monthly, and quarterly horizons.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-2xl mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Consultant & Professional Setup</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional's Name</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={state.profile.name}
              onChange={e => updateProfile('name', e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={state.profile.role}
              onChange={e => updateProfile('role', e.target.value)}
              placeholder="e.g. Marketing Director"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={state.profile.hourlyRate}
              onChange={e => updateProfile('hourlyRate', Number(e.target.value))}
              placeholder="e.g. 150"
            />
            <p className="text-xs text-gray-500 mt-1">Used to calculate financial ROI</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Task Inventory</h2>
        <p className="text-gray-600">Document the tasks that take up the majority of your time each week.</p>
      </div>

      <div className="space-y-4">
        {state.tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <div className="md:col-span-1">
                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Task Name</label>
                <input 
                  type="text" 
                  value={task.name}
                  onChange={e => updateTask(task.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Category</label>
                <select 
                  value={task.category}
                  onChange={e => updateTask(task.id, 'category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Hours / Week</label>
                <input 
                  type="number" 
                  value={task.hoursPerWeek}
                  onChange={e => updateTask(task.id, 'hoursPerWeek', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0" step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Importance (1-10)</label>
                <input 
                  type="number" 
                  value={task.importance}
                  onChange={e => updateTask(task.id, 'importance', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1" max="10"
                />
              </div>
            </div>
            <button 
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:text-red-700 p-2"
              title="Remove task"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <button 
          onClick={addTask}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium py-2 px-4 rounded-md border border-purple-300 hover:bg-purple-100 transition-colors"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">AI Automation Mapping</h2>
        <p className="text-gray-600">Adjust the estimated automation potential and customize the recommended AI tools for each task.</p>
      </div>

      <div className="space-y-4">
        {state.tasks.map(task => (
          <div key={task.id} className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{task.name}</h3>
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {task.category} • {task.hoursPerWeek} hrs/wk
                </span>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                  Automation Potential: {task.automationPotential}%
                </label>
                <input 
                  type="range" 
                  min="0" max="100" step="5"
                  value={task.automationPotential}
                  onChange={e => updateTask(task.id, 'automationPotential', Number(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0% (None)</span>
                  <span>100% (Full)</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Suggested AI Tools / Solutions</label>
              <input 
                type="text" 
                value={task.suggestedTools}
                onChange={e => updateTask(task.id, 'suggestedTools', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        ))}
        {state.tasks.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            No tasks found. Go back and add some tasks first.
          </div>
        )}
      </div>
    </div>
  );

  const calculateROI = () => {
    let totalHours = 0;
    let savedHours = 0;

    const chartData = state.tasks.map(task => {
      const saved = task.hoursPerWeek * (task.automationPotential / 100);
      totalHours += task.hoursPerWeek;
      savedHours += saved;
      return {
        name: task.name,
        'Original Hours': task.hoursPerWeek,
        'Saved Hours': Number(saved.toFixed(1)),
        'Remaining Hours': Number((task.hoursPerWeek - saved).toFixed(1))
      };
    });

    const weeklySavedValue = savedHours * state.profile.hourlyRate;
    
    return {
      totalHours,
      savedHours,
      chartData,
      weekly: { hours: savedHours, dollars: weeklySavedValue },
      monthly: { hours: savedHours * 4.33, dollars: weeklySavedValue * 4.33 },
      quarterly: { hours: savedHours * 13, dollars: weeklySavedValue * 13 }
    };
  };

  const renderStep3 = () => {
    const roi = calculateROI();
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ROI Dashboard</h2>
          <p className="text-gray-600">Projected impact of AI adoption on your workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-2xl text-white shadow-md">
            <h3 className="text-purple-100 font-medium mb-1">Weekly Savings</h3>
            <div className="text-3xl font-bold mb-2">{roi.weekly.hours.toFixed(1)} hrs</div>
            <div className="text-xl text-purple-200">${roi.weekly.dollars.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl text-white shadow-md">
            <h3 className="text-purple-100 font-medium mb-1">Monthly Savings</h3>
            <div className="text-3xl font-bold mb-2">{roi.monthly.hours.toFixed(1)} hrs</div>
            <div className="text-xl text-purple-200">${roi.monthly.dollars.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-800 to-purple-950 p-6 rounded-2xl text-white shadow-md">
            <h3 className="text-purple-100 font-medium mb-1">Quarterly Savings</h3>
            <div className="text-3xl font-bold mb-2">{roi.quarterly.hours.toFixed(1)} hrs</div>
            <div className="text-xl text-purple-200">${roi.quarterly.dollars.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Time Recovery per Task</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roi.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Saved Hours" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="Remaining Hours" stackId="a" fill="#e5e7eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Current vs Future Allocation</h3>
            <div className="flex items-center justify-center h-72">
              <div className="w-1/2 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-2">Current Total</div>
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{roi.totalHours.toFixed(1)}h</span>
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-center">
                <div className="text-sm text-purple-700 mb-2 font-medium">With AI</div>
                <div className="w-32 h-32 rounded-full border-8 border-purple-700 flex items-center justify-center relative">
                  <span className="text-2xl font-bold text-purple-900">{(roi.totalHours - roi.savedHours).toFixed(1)}h</span>
                  <div className="absolute -top-4 -right-4 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    -{roi.totalHours > 0 ? ((roi.savedHours / roi.totalHours) * 100).toFixed(0) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const roi = calculateROI();

    return (
      <div className="space-y-6 animate-fade-in print-area" id="report-content">
        <div className="border-b border-gray-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI ROI Action Plan</h1>
            <p className="text-gray-600">Prepared for <span className="font-semibold text-gray-800">{state.profile.name || 'Client'}</span>, {state.profile.role}</p>
          </div>
          <div className="text-right hidden sm:block">
            <img src="https://centerforappliedai.com/wp-content/uploads/2025/03/8e2adab0e3f168217b0338d68bba5992.png" alt="Logo" className="h-10 opacity-80" />
            <p className="text-xs text-gray-500 mt-2">Center for Applied AI</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            By integrating targeted, human-centered AI tools into routine workflows, we project a recovery of 
            <strong className="text-purple-600"> {roi.weekly.hours.toFixed(1)} hours per week</strong>. 
            Valued at an hourly rate of ${state.profile.hourlyRate}, this represents an equivalent productivity gain of 
            <strong className="text-purple-700"> ${roi.monthly.dollars.toLocaleString(undefined, {maximumFractionDigits:0})} per month</strong> or 
            <strong className="text-purple-900"> ${roi.quarterly.dollars.toLocaleString(undefined, {maximumFractionDigits:0})} per quarter</strong>.
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Recommended Toolkit & Automation Targets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task / Workflow</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Potential</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Saved</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Tools</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.tasks.sort((a,b) => (b.hoursPerWeek * b.automationPotential) - (a.hoursPerWeek * a.automationPotential)).map((task) => {
                const saved = task.hoursPerWeek * (task.automationPotential / 100);
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.hoursPerWeek}h/wk</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${task.automationPotential >= 50 ? 'bg-green-100 text-green-800' : 
                          task.automationPotential >= 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {task.automationPotential}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700 font-semibold">{saved.toFixed(1)}h/wk</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{task.suggestedTools}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center print-hide">
          <button 
            onClick={() => window.print()}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mx-auto font-medium"
          >
            <Download size={20} /> Download PDF Report
          </button>
          <p className="text-sm text-gray-500 mt-3">Use your browser's Print dialog to save as PDF</p>
        </div>
      </div>
    );
  };

  const steps = [
    { title: "Strategy Setup", render: renderStep0 },
    { title: "Task Inventory", render: renderStep1 },
    { title: "AI Potential", render: renderStep2 },
    { title: "ROI Projection", render: renderStep3 },
    { title: "Action Plan", render: renderStep4 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
      {/* Progress Bar (hidden in print) */}
      <div className="mb-8 print-hide">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500 to-purple-900 -z-10 transition-all duration-300 rounded-full"
            style={{ width: `${(state.currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${idx <= state.currentStep ? 'text-purple-700' : 'text-gray-400'}`}
              onClick={() => setState(s => ({ ...s, currentStep: idx }))}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all
                ${idx < state.currentStep ? 'bg-purple-600 text-white' : 
                  idx === state.currentStep ? 'bg-white border-2 border-purple-600 text-purple-600 shadow-md transform scale-110' : 
                  'bg-white border-2 border-gray-200 text-gray-400'}`}
              >
                {idx + 1}
              </div>
              <span className="text-xs font-semibold hidden md:block bg-white px-1">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl p-6 md:p-10 mb-8 min-h-[500px]">
        {steps[state.currentStep].render()}
      </div>

      {/* Navigation (hidden in print) */}
      <div className="flex justify-between items-center print-hide">
        <button
          onClick={handlePrev}
          disabled={state.currentStep === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
            ${state.currentStep === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'}`}
        >
          <ArrowLeft size={18} /> Back
        </button>
        
        {state.currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-purple-950 text-white px-6 py-3 rounded-lg shadow-md transition-all font-medium"
          >
            Next Step <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-purple-950 text-white px-6 py-3 rounded-lg shadow-md transition-all font-medium"
          >
            <Download size={18} /> Export Report
          </button>
        )}
      </div>
    </div>
  );
}