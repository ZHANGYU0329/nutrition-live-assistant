import FemaleNutritionTable from './components/FemaleNutritionTable'

function App() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 px-4">
        <main>
          <FemaleNutritionTable />
        </main>
        
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 女生减肥健康管理 - 科学计算体重、BMI和营养需求</p>
        </footer>
      </div>
    </div>
  )
}

export default App
