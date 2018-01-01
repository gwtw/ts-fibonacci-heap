import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/custom-compare-tests';

testHelper.run(test, FibonacciHeap);
