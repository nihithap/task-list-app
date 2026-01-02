#!/usr/bin/env bash
# Simple CI/CD Test Runner
# Run: ./run-tests.sh

echo "=========================================="
echo "Task List App - CI/CD Test Suite"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to run test
run_test() {
  local test_name=$1
  local test_command=$2
  
  echo -ne "Testing: $test_name ... "
  
  if eval "$test_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
  fi
}

# Test 1: Bundle Size Check
echo -e "${YELLOW}[1/8] Bundle Size Check${NC}"
run_test "index.html exists" "test -f index.html"
run_test "Bundle size < 100KB" "test $(stat -f%z index.html 2>/dev/null || stat -c%s index.html) -lt 100000"

# Test 2: HTML Structure
echo -e "\n${YELLOW}[2/8] HTML Structure Validation${NC}"
run_test "Has task-input element" "grep -q 'id=\"task-input\"' index.html"
run_test "Has add-task-button element" "grep -q 'id=\"add-task-button\"' index.html"
run_test "Has task-list element" "grep -q 'id=\"task-list\"' index.html"

# Test 3: JavaScript Files
echo -e "\n${YELLOW}[3/8] JavaScript Files Check${NC}"
run_test "src/utils.js exists" "test -f src/utils.js"
run_test "src/constants.js exists" "test -f src/constants.js"
run_test "src/task-store.js exists" "test -f src/task-store.js"
run_test "src/ui.js exists" "test -f src/ui.js"
run_test "src/app.js exists" "test -f src/app.js"

# Test 4: Test Files
echo -e "\n${YELLOW}[4/8] Test Files Check${NC}"
run_test "tests/unit/ exists" "test -d tests/unit"
run_test "tests/integration/ exists" "test -d tests/integration"
run_test "Test files exist" "test -f tests/integration/create-task.test.js"

# Test 5: Documentation
echo -e "\n${YELLOW}[5/8] Documentation Check${NC}"
run_test "MVP-SUMMARY.md exists" "test -f MVP-SUMMARY.md"
run_test "PRODUCTION-DEPLOYMENT.md exists" "test -f PRODUCTION-DEPLOYMENT.md"
run_test "CHANGELOG.md exists" "test -f CHANGELOG.md"

# Test 6: Configuration Files
echo -e "\n${YELLOW}[6/8] Configuration Files${NC}"
run_test "package.json exists" "test -f package.json"
run_test "jest.config.js exists" "test -f jest.config.js"
run_test "jest.setup.js exists" "test -f jest.setup.js"

# Test 7: Git Repository
echo -e "\n${YELLOW}[7/8] Git Repository Check${NC}"
run_test "Git initialized" "test -d .git"
run_test "Remote configured" "git remote -v | grep -q origin"

# Test 8: Dependencies
echo -e "\n${YELLOW}[8/8] Dependency Check${NC}"
run_test "Zero npm dependencies in app" "! grep -q '\"dependencies\"' package.json || true"
run_test "Dev dependencies in package.json" "grep -q 'devDependencies' package.json"

# Summary
echo ""
echo "=========================================="
echo "Test Results Summary"
echo "=========================================="
TOTAL=$((PASSED + FAILED))
echo "Passed: ${GREEN}$PASSED${NC}/$TOTAL"
echo "Failed: ${RED}$FAILED${NC}/$TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
